package csvsql

import (
	"database/sql"
	"encoding/csv"
	"github.com/bujupah/excel/pkg/models"
	"github.com/bujupah/excel/pkg/src/constants"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/grafana/grafana-plugin-sdk-go/data/sqlutil"
	"os"
	"reflect"
	"strings"
	"time"
)

var logger = log.New()

func Scan(rs *sql.Rows, query models.QueryModel) (*data.Frame, error) {
	defer rs.Close()
	converters := []sqlutil.Converter{
		sqlutil.NewDefaultConverter("id", true, reflect.TypeOf(1)),
		sqlutil.NewDefaultConverter("value", true, reflect.TypeOf(int64(1))),
		sqlutil.NewDefaultConverter("time", true, reflect.TypeOf(time.Time{})),
		sqlutil.NewDefaultConverter("metric", true, reflect.TypeOf("")),
	}
	frames, err := sqlutil.FrameFromRows(rs, query.MaxDataPoints, converters...)
	return frames, err
}

type Table struct {
	Name    string   `json:"table"`
	Columns []string `json:"columns"`
}

func GetTables(Uid string, tenantId int64) []Table {
	dsFolder := constants.TenantDatasourceFolder(Uid, tenantId)
	// get all csv files
	files, _ := os.ReadDir(dsFolder)

	tables := make([]Table, 0)
	for _, file := range files {
		if !strings.Contains(file.Name(), ".csv") {
			continue
		}
		f, _ := os.Open(dsFolder + "/" + file.Name())
		reader := csv.NewReader(f)
		headers, err := reader.Read()
		if err == nil {
			tables = append(tables, Table{
				Name:    file.Name(),
				Columns: headers,
			})
		}
		f.Close()
	}

	return tables
}

type Column struct {
	Name   string
	Values []interface{}
	Type   string
}
