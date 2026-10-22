// Package opendeploy holds the domain models and repository contracts shared by
// the server, the datastores and the mocks. Models carry gorm tags, but the
// package never opens a connection: that is internal/datastore/postgres.
package opendeploy
