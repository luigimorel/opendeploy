package opendeploy

import (
	"context"

	"github.com/google/uuid"
)

type Organization struct {
	Model
	Name     string `json:"name"     gorm:"not null;uniqueIndex"`
	PlanName string `json:"planName" gorm:"not null;default:free"`
	IsActive bool   `json:"isActive" gorm:"not null;default:true"`
}

type OrganizationRepository interface {
	Create(context.Context, *Organization) (*Organization, error)
	List(ctx context.Context, id uuid.UUID) (*Organization, error)
}
