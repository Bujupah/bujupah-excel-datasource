package csvsql

import (
	"context"
	"database/sql"
	"github.com/bujupah/excel/pkg/models"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	_ "github.com/mithrandie/csvq-driver"
)

type Database struct {
	db       *sql.DB
	Space    string
	Version  string
	TenantId int64
}

func New(tenantId int64, dsUid string, dsVersion string, onPullNewData func(string) error) (*Database, error) {
	logger := log.New()

	dbPath, _, err := CreateSpace(dsUid, tenantId)
	if err != nil {
		return nil, NewError("Failed to create tenant space", err)
	}

	shouldUpdate, version, err := VerifyVersion(tenantId, dsUid, dsVersion)
	if err != nil {
		return nil, NewError("Failed to verify db version", err)
	}
	if shouldUpdate {
		if err := onPullNewData(dbPath); err != nil {
			return nil, NewError("Failed to pull new data", err)
		}
	} else {
		logger.Info("Database is up to date", "version", version)
	}

	db, err := sql.Open("csvq", dbPath)
	if err != nil {

		return nil, NewError("Failed to open database", err)
	}

	if err := db.Ping(); err != nil {
		return nil, NewError("Failed to ping database", err)
	}

	return &Database{
		db:       db,
		Space:    dsUid,
		Version:  dsVersion,
		TenantId: tenantId,
	}, nil
}

func (i *Database) RunQuery(ctx context.Context, query models.QueryModel) (*data.Frame, error) {
	r, err := i.db.QueryContext(ctx, query.RawSql)
	if err != nil {
		return nil, NewError("Failed to query database", err)
	}

	scanResult, err := Scan(r, query)
	if err != nil {
		return nil, NewError("Failed to scan rows", err)
	}

	return scanResult, nil
}

func (i *Database) Close() error {
	return i.db.Close()
}
