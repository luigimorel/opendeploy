package postgres

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"luigimorel.com/opendeploy"
)

type organizationRepo struct{ db *gorm.DB }

func NewOrganizationRepository(db *gorm.DB) opendeploy.OrganizationRepository {
	return &organizationRepo{db: db}
}

func (r *organizationRepo) Create(ctx context.Context, o *opendeploy.Organization) (*opendeploy.Organization, error) {
	ctx, cancel := withContext(ctx)
	defer cancel()

	if err := r.db.WithContext(ctx).Create(o).Error; err != nil {
		return nil, translate(err, "organization")
	}
	return o, nil
}

func (r *organizationRepo) List(ctx context.Context, id uuid.UUID) (*opendeploy.Organization, error) {
	ctx, cancel := withContext(ctx)
	defer cancel()

	var o opendeploy.Organization
	if err := r.db.WithContext(ctx).First(&o, "id = ?", id).Error; err != nil {
		return nil, translate(err, "organization "+id.String())
	}
	return &o, nil
}
