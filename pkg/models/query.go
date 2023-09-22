package models

type QueryModel struct {
	ColumnsType []interface{} `json:"columnsType"`
	DataSource  struct {
		Type string `json:"type"`
		UID  string `json:"uid"`
	}
	RawSql        string `json:"rawSql"`
	RefID         string `json:"refId"`
	DataSourceID  int    `json:"datasourceId"`
	IntervalMs    int    `json:"intervalMs"`
	MaxDataPoints int64  `json:"maxDataPoints"`
}
