// Package postgres implements the Open Deploy repositories on top of gorm.
package postgres

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"luigimorel.com/opendeploy"
	"luigimorel.com/opendeploy/config"
)

// timeout bounds every repository call; set by New.
var timeout = 10 * time.Second

func withContext(ctx context.Context) (context.Context, context.CancelFunc) {
	return context.WithTimeout(ctx, timeout)
}

// New opens the connection pool and pings the database. Schema changes are
// NOT applied here: they live in ./migrations and run with `task migrate`.
func New(cfg config.Database, log *slog.Logger) (*gorm.DB, error) {
	level := logger.Silent
	if cfg.LogQueries {
		level = logger.Info
	}
	db, err := gorm.Open(postgres.Open(cfg.DSN), &gorm.Config{
		Logger:         logger.New(slogWriter{log}, logger.Config{LogLevel: level, SlowThreshold: 200 * time.Millisecond}),
		TranslateError: true, // map pg errors to gorm.ErrDuplicatedKey, etc.
		NowFunc:        func() time.Time { return time.Now().UTC() },
	})
	if err != nil {
		return nil, fmt.Errorf("open database: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	sqlDB.SetMaxOpenConns(cfg.MaxOpenConns)
	sqlDB.SetMaxIdleConns(cfg.MaxIdleConns)
	sqlDB.SetConnMaxLifetime(30 * time.Minute)

	if cfg.QueryTimeout > 0 {
		timeout = cfg.QueryTimeout
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := sqlDB.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("ping database: %w", err)
	}
	return db, nil
}

// Close releases the pool.
func Close(db *gorm.DB) error {
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

// translate converts gorm errors into the domain's sentinel errors.
func translate(err error, what string) error {
	switch {
	case err == nil:
		return nil
	case errors.Is(err, gorm.ErrRecordNotFound):
		return fmt.Errorf("%s: %w", what, opendeploy.ErrNotFound)
	case errors.Is(err, gorm.ErrDuplicatedKey), opendeploy.IsDuplicateUniqueError(err):
		return fmt.Errorf("%s: %w", what, opendeploy.ErrConflict)
	default:
		return err
	}
}

// paginate applies the paginator to a query.
func paginate(p opendeploy.Paginator) func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Offset(p.Offset()).Limit(int(p.Limit()))
	}
}

type slogWriter struct{ l *slog.Logger }

func (w slogWriter) Printf(format string, args ...any) {
	w.l.Debug(fmt.Sprintf(format, args...))
}
