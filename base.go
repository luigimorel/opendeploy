package opendeploy

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Model is embedded in every table: UUID primary key, timestamps and soft delete.
// gorm filters soft-deleted rows (deleted_at IS NOT NULL) out of every query.
type Model struct {
	ID        uuid.UUID      `json:"id"        gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	CreatedAt time.Time      `json:"createdAt" gorm:"not null;autoCreateTime"`
	UpdatedAt time.Time      `json:"updatedAt" gorm:"not null;autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"-"         gorm:"index"`
}
