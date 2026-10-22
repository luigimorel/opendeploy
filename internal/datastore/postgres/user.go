package postgres

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"luigimorel.com/opendeploy"
)

type userRepo struct{ db *gorm.DB }

func NewUserRepository(db *gorm.DB) opendeploy.UserRepository { return &userRepo{db: db} }

func (r *userRepo) Create(ctx context.Context, u *opendeploy.User) (*opendeploy.User, error) {
	ctx, cancel := withContext(ctx)
	defer cancel()

	u.Email = opendeploy.Email(u.Email.String())
	if err := r.db.WithContext(ctx).Create(u).Error; err != nil {
		return nil, translate(err, "user "+u.Email.String())
	}
	return u, nil
}

func (r *userRepo) filter(q *gorm.DB, o *opendeploy.FindUserOptions) *gorm.DB {
	if o == nil {
		return q
	}
	if o.ID != uuid.Nil {
		q = q.Where("id = ?", o.ID)
	}
	if e := o.Email.String(); e != "" {
		q = q.Where("email = ?", e)
	}
	if o.OrganizationID != uuid.Nil {
		q = q.Where("organization_id = ?", o.OrganizationID)
	}
	return q
}

func (r *userRepo) List(ctx context.Context, o *opendeploy.FindUserOptions) (*opendeploy.User, error) {
	ctx, cancel := withContext(ctx)
	defer cancel()

	var u opendeploy.User
	if err := r.filter(r.db.WithContext(ctx), o).First(&u).Error; err != nil {
		return nil, translate(err, "user")
	}
	return &u, nil
}

func (r *userRepo) ListAll(ctx context.Context, o *opendeploy.FindUserOptions) ([]*opendeploy.User, int64, error) {
	ctx, cancel := withContext(ctx)
	defer cancel()

	var (
		users []*opendeploy.User
		total int64
	)
	q := r.filter(r.db.WithContext(ctx).Model(&opendeploy.User{}), o)
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if o != nil {
		q = q.Scopes(paginate(o.Paginator))
	}
	if err := q.Order("created_at DESC").Find(&users).Error; err != nil {
		return nil, 0, err
	}
	return users, total, nil
}

func (r *userRepo) Update(ctx context.Context, u *opendeploy.User) (*opendeploy.User, error) {
	ctx, cancel := withContext(ctx)
	defer cancel()

	u.Email = opendeploy.Email(u.Email.String())
	// Select is explicit so zero values (e.g. a cleared EmailVerifiedAt) are written.
	res := r.db.WithContext(ctx).Model(u).
		Select("email", "full_name", "status", "email_verified_at").
		Updates(u)
	if res.Error != nil {
		return nil, translate(res.Error, "user "+u.ID.String())
	}
	if res.RowsAffected == 0 {
		return nil, translate(gorm.ErrRecordNotFound, "user "+u.ID.String())
	}
	return u, nil
}
