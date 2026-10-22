// Package mocks holds hand-written, function-field test doubles for the
// opendeploy repository interfaces. Set only the funcs a test needs; unset ones
// panic so a missed call is loud. Swap for mockgen output whenever you prefer gomock.
package mocks

import (
	"context"

	"github.com/google/uuid"

	"luigimorel.com/opendeploy"
)

type OrganizationRepository struct {
	CreateFn func(context.Context, *opendeploy.Organization) (*opendeploy.Organization, error)
	GetFn    func(context.Context, uuid.UUID) (*opendeploy.Organization, error)
}

var _ opendeploy.OrganizationRepository = (*OrganizationRepository)(nil)

func (m *OrganizationRepository) Create(ctx context.Context, o *opendeploy.Organization) (*opendeploy.Organization, error) {
	return m.CreateFn(ctx, o)
}

func (m *OrganizationRepository) List(ctx context.Context, id uuid.UUID) (*opendeploy.Organization, error) {
	return m.GetFn(ctx, id)
}
