// Package config reads runtime configuration from the environment.
package config

import (
	"os"
	"strconv"
	"time"
)

// Config is the full runtime configuration of the server.
type Config struct {
	Addr string

	ReadHeaderTimeout time.Duration
	ReadTimeout       time.Duration
	WriteTimeout      time.Duration
	IdleTimeout       time.Duration
	ShutdownTimeout   time.Duration

	Database Database
}

// Database configures the Postgres connection.
type Database struct {
	// DSN, e.g. postgres://postgres:password@localhost:5432/opendeploy?sslmode=disable
	DSN          string
	QueryTimeout time.Duration
	MaxOpenConns int
	MaxIdleConns int
	LogQueries   bool
}

// Load builds a Config from the environment:
// ADDR or PORT, DATABASE_URL, DB_QUERY_TIMEOUT, DB_MAX_OPEN_CONNS,
// DB_MAX_IDLE_CONNS, DB_LOG_QUERIES.
func Load() Config {
	return Config{
		Addr:              addrFromEnv(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
		ShutdownTimeout:   10 * time.Second,
		Database: Database{
			DSN:          env("DATABASE_URL", "postgres://postgres:password@localhost:5432/opendeploy?sslmode=disable"),
			QueryTimeout: duration("DB_QUERY_TIMEOUT", 10*time.Second),
			MaxOpenConns: integer("DB_MAX_OPEN_CONNS", 25),
			MaxIdleConns: integer("DB_MAX_IDLE_CONNS", 5),
			LogQueries:   os.Getenv("DB_LOG_QUERIES") == "true",
		},
	}
}

func addrFromEnv() string {
	if a := os.Getenv("ADDR"); a != "" {
		return a
	}
	if p := os.Getenv("PORT"); p != "" {
		return ":" + p
	}
	return ":8080"
}

func env(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func integer(key string, def int) int {
	if n, err := strconv.Atoi(os.Getenv(key)); err == nil && n > 0 {
		return n
	}
	return def
}

func duration(key string, def time.Duration) time.Duration {
	if d, err := time.ParseDuration(os.Getenv(key)); err == nil && d > 0 {
		return d
	}
	return def
}
