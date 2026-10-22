package opendeploy

import "strings"

// Error is a constant-friendly error type, so sentinel errors can be declared
// as consts and compared with errors.Is.
type Error string

func (e Error) Error() string { return string(e) }

// Sentinel errors that repositories return and the server maps to HTTP statuses.
// Wrap them with fmt.Errorf("project %s: %w", id, ErrNotFound) to add context.
const (
	ErrNotFound = Error("not found")
	ErrInvalid  = Error("invalid input")
	ErrConflict = Error("already exists")
)

// IsDuplicateUniqueError reports whether err is a Postgres unique violation.
func IsDuplicateUniqueError(err error) bool {
	if err == nil {
		return false
	}
	return strings.Contains(err.Error(), "duplicate key value violates unique constraint") ||
		strings.Contains(err.Error(), "SQLSTATE 23505")
}
