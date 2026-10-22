package opendeploy

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"
)

// ENUM(active, inactive, pending)
type UserStatus string

const (
	UserStatusActive   UserStatus = "active"
	UserStatusInactive UserStatus = "inactive"
	UserStatusPending  UserStatus = "pending"
)

// Email is always stored lower-cased.
type Email string

func (e Email) String() string { return strings.ToLower(strings.TrimSpace(string(e))) }

type User struct {
	Model
	OrganizationID  uuid.UUID  `json:"organizationId" gorm:"type:uuid;not null;index"`
	Email           Email      `json:"email"          gorm:"not null;uniqueIndex"`
	FullName        string     `json:"fullName"       gorm:"not null"`
	Status          UserStatus `json:"status"         gorm:"not null;default:pending"`
	EmailVerifiedAt *time.Time `json:"emailVerifiedAt"`
}

type FindUserOptions struct {
	ID             uuid.UUID
	Email          Email
	OrganizationID uuid.UUID
	Paginator      Paginator
}

type UserRepository interface {
	// Create returns ErrConflict when the email is already taken.
	Create(context.Context, *User) (*User, error)
	// List returns one user, or ErrNotFound.
	List(context.Context, *FindUserOptions) (*User, error)
	ListAll(context.Context, *FindUserOptions) ([]*User, int64, error)
	Update(context.Context, *User) (*User, error)
}
