package mocks

import (
	"context"

	"luigimorel.com/opendeploy"
)

type UserRepository struct {
	CreateFn  func(context.Context, *opendeploy.User) (*opendeploy.User, error)
	ListFn    func(context.Context, *opendeploy.FindUserOptions) (*opendeploy.User, error)
	ListAllFn func(context.Context, *opendeploy.FindUserOptions) ([]*opendeploy.User, int64, error)
	UpdateFn  func(context.Context, *opendeploy.User) (*opendeploy.User, error)
}

var _ opendeploy.UserRepository = (*UserRepository)(nil)

func (m *UserRepository) Create(ctx context.Context, u *opendeploy.User) (*opendeploy.User, error) {
	return m.CreateFn(ctx, u)
}

func (m *UserRepository) List(ctx context.Context, o *opendeploy.FindUserOptions) (*opendeploy.User, error) {
	return m.ListFn(ctx, o)
}

func (m *UserRepository) ListAll(ctx context.Context, o *opendeploy.FindUserOptions) ([]*opendeploy.User, int64, error) {
	return m.ListAllFn(ctx, o)
}

func (m *UserRepository) Update(ctx context.Context, u *opendeploy.User) (*opendeploy.User, error) {
	return m.UpdateFn(ctx, u)
}
