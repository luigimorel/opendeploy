// Package seed fills an empty database with demo data so the UI has something to show.
package seed

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"luigimorel.com/opendeploy"
	"luigimorel.com/opendeploy/internal/datastore/postgres"
)

const demoOrgName = "Demo Org"

// Run is idempotent: it does nothing if the demo organization already exists.
// It returns the organization ID either way.
func Run(ctx context.Context, db *gorm.DB) (uuid.UUID, error) {
	var existing opendeploy.Organization
	err := db.WithContext(ctx).Where("name = ?", demoOrgName).First(&existing).Error
	if err == nil {
		return existing.ID, nil
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return uuid.Nil, err
	}

	org, err := postgres.NewOrganizationRepository(db).Create(ctx, &opendeploy.Organization{Name: demoOrgName})
	if err != nil {
		return uuid.Nil, fmt.Errorf("create organization: %w", err)
	}

	if _, err := postgres.NewUserRepository(db).Create(ctx, &opendeploy.User{
		OrganizationID: org.ID,
		Email:          "demo@example.com",
		FullName:       "Demo User",
		Status:         opendeploy.UserStatusActive,
	}); err != nil {
		return uuid.Nil, fmt.Errorf("create user: %w", err)
	}

	return org.ID, nil
}
