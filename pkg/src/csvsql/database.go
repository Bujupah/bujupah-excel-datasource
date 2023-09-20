package csvsql

import (
	"context"
	"database/sql"
	"fmt"
	_ "github.com/mithrandie/csvq-driver"
)

type Database struct {
	db       *sql.DB
	Space    string
	Version  string
	TenantId int64
}

func New(tenantId int64, dsName string, dsVersion string, onPullNewData func(string) error) (*Database, error) {
	dbPath, _, err := CreateSpace(tenantId)
	if err != nil {
		return nil, NewError("Failed to create tenant space", err)
	}

	shouldUpdate, version, err := VerifyVersion(tenantId, dsName, dsVersion)
	if err != nil {
		return nil, NewError("Failed to verify db version", err)
	}
	if shouldUpdate {
		if err := onPullNewData(dbPath); err != nil {
			return nil, NewError("Failed to pull new data", err)
		}
	} else {
		fmt.Printf("Database is up to date v%v\n", version)
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
		Space:    dsName,
		Version:  dsVersion,
		TenantId: tenantId,
	}, nil
}

func (i *Database) RunQuery(ctx context.Context, query string) ([][]interface{}, error) {
	r, err := i.db.QueryContext(ctx, query)
	if err != nil {
		return nil, NewError("Failed to query database", err)
	}
	defer r.Close()

	data, err := Scan(r)
	if err != nil {
		return nil, NewError("Failed to scan rows", err)
	}

	return data, nil
}
