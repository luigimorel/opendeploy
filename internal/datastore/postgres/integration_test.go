//go:build integration

package postgres_test

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"os"
	"testing"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/yourorg/opendeploy/config"
	"github.com/yourorg/opendeploy/internal/datastore/postgres"
	"github.com/yourorg/opendeploy/internal/seed"
	"luigimorel.com/opendeploy"
)

// Run with: TEST_DATABASE_URL=postgres://... task test-all
// The database must already be migrated. Every test works inside its own
// organization, so tests never collide and no cleanup is needed between them.
func testDB(t *testing.T) *gorm.DB {
	t.Helper()
	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		t.Skip("TEST_DATABASE_URL not set")
	}
	db, err := postgres.New(config.Database{DSN: dsn, QueryTimeout: 5 * time.Second, MaxOpenConns: 5, MaxIdleConns: 2},
		slog.New(slog.NewTextHandler(io.Discard, nil)))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = postgres.Close(db) })
	return db
}

func newOrg(t *testing.T, db *gorm.DB) *opendeploy.Organization {
	t.Helper()
	org, err := postgres.NewOrganizationRepository(db).Create(context.Background(),
		&opendeploy.Organization{Name: "org-" + uuid.NewString()})
	if err != nil {
		t.Fatal(err)
	}
	return org
}

func TestUsersAreUniqueByEmail(t *testing.T) {
	ctx, db := context.Background(), testDB(t)
	org := newOrg(t, db)
	repo := postgres.NewUserRepository(db)

	email := opendeploy.Email("Jane-" + uuid.NewString() + "@Example.com")
	u, err := repo.Create(ctx, &opendeploy.User{OrganizationID: org.ID, Email: email, FullName: "Jane"})
	if err != nil {
		t.Fatal(err)
	}
	if u.Email.String() != string(u.Email) {
		t.Fatalf("email not normalised: %q", u.Email)
	}
	if _, err := repo.Create(ctx, &opendeploy.User{OrganizationID: org.ID, Email: email, FullName: "Dup"}); !errors.Is(err, opendeploy.ErrConflict) {
		t.Fatalf("duplicate: err = %v, want ErrConflict", err)
	}

	found, err := repo.List(ctx, &opendeploy.FindUserOptions{Email: email})
	if err != nil || found.ID != u.ID {
		t.Fatalf("List by email = %+v, %v", found, err)
	}

	now := time.Now().UTC()
	u.Status, u.EmailVerifiedAt = opendeploy.UserStatusActive, &now
	if _, err := repo.Update(ctx, u); err != nil {
		t.Fatal(err)
	}
	again, _ := repo.List(ctx, &opendeploy.FindUserOptions{ID: u.ID})
	if again.Status != opendeploy.UserStatusActive || again.EmailVerifiedAt == nil {
		t.Fatalf("update not persisted: %+v", again)
	}

	if _, err := repo.List(ctx, &opendeploy.FindUserOptions{Email: "nobody@example.com"}); !errors.Is(err, opendeploy.ErrNotFound) {
		t.Fatalf("missing user: err = %v", err)
	}
}

func TestOrganizationsAreUniqueByName(t *testing.T) {
	ctx, db := context.Background(), testDB(t)
	repo := postgres.NewOrganizationRepository(db)

	name := "org-" + uuid.NewString()
	o, err := repo.Create(ctx, &opendeploy.Organization{Name: name})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := repo.Create(ctx, &opendeploy.Organization{Name: name}); !errors.Is(err, opendeploy.ErrConflict) {
		t.Fatalf("duplicate: err = %v, want ErrConflict", err)
	}
	got, err := repo.Get(ctx, o.ID)
	if err != nil || got.Name != name || !got.IsActive {
		t.Fatalf("Get = %+v, %v", got, err)
	}
	if _, err := repo.Get(ctx, uuid.New()); !errors.Is(err, opendeploy.ErrNotFound) {
		t.Fatalf("missing org: err = %v, want ErrNotFound", err)
	}
}

func TestSoftDelete(t *testing.T) {
	ctx, db := context.Background(), testDB(t)
	org := newOrg(t, db)
	repo := postgres.NewUserRepository(db)

	email := opendeploy.Email("gone-" + uuid.NewString() + "@example.com")
	u, err := repo.Create(ctx, &opendeploy.User{OrganizationID: org.ID, Email: email, FullName: "Gone"})
	if err != nil {
		t.Fatal(err)
	}
	if err := db.WithContext(ctx).Delete(u).Error; err != nil {
		t.Fatal(err)
	}
	if _, err := repo.List(ctx, &opendeploy.FindUserOptions{ID: u.ID}); !errors.Is(err, opendeploy.ErrNotFound) {
		t.Fatalf("soft-deleted user still visible: %v", err)
	}
	// The unique index ignores deleted rows, so the email can be reused.
	if _, err := repo.Create(ctx, &opendeploy.User{OrganizationID: org.ID, Email: email, FullName: "Reborn"}); err != nil {
		t.Fatalf("email not reusable after soft delete: %v", err)
	}
}

func TestSeedIsIdempotent(t *testing.T) {
	ctx, db := context.Background(), testDB(t)
	first, err := seed.Run(ctx, db)
	if err != nil {
		t.Fatal(err)
	}
	second, err := seed.Run(ctx, db)
	if err != nil || first != second {
		t.Fatalf("second seed = %v, %v (first %v)", second, err, first)
	}
}
