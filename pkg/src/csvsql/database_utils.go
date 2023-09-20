package csvsql

import (
	"database/sql"
	"strconv"
)

func Scan(rs *sql.Rows) (rows [][]interface{}, err error) {
	columns, err := rs.Columns()
	if err != nil {
		return nil, err
	}
	var row = make([]interface{}, 0, len(columns))
	for range columns {
		row = append(row, new(interface{}))
	}

	for rs.Next() {
		if err := rs.Scan(row...); err != nil {
			return nil, err
		}
		rowValues := make([]interface{}, len(columns))
		for i := range columns {
			rowValues[i] = *row[i].(*interface{})
		}
		rows = append(rows, rowValues)
	}

	return rows, nil
}

type Column struct {
	Value interface{}
	Type  string
}

func SetTypeMap(rows [][]interface{}) [][]Column {
	result := make([][]Column, 0)

	for _, row := range rows {
		columns := make([]Column, 0)
		for _, col := range row {
			if col == nil {
				columns = append(columns, Column{
					Value: nil,
					Type:  "nil",
				})
				continue
			}

			if v, err := strconv.ParseInt(col.(string), 10, 64); err == nil {
				columns = append(columns, Column{
					Value: v,
					Type:  "int64",
				})
				continue
			}

			if v, err := strconv.ParseFloat(col.(string), 64); err == nil {
				columns = append(columns, Column{
					Value: v,
					Type:  "float64",
				})
				continue
			}

			if v, err := strconv.ParseBool(col.(string)); err == nil {
				columns = append(columns, Column{
					Value: v,
					Type:  "bool",
				})
				continue
			}

			columns = append(columns, Column{
				Value: col,
				Type:  "string",
			})
		}
		result = append(result, columns)
	}

	return result
}
