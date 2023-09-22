package plugin

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/Bujupah/go4ftp"
	"github.com/bujupah/excel/pkg/models"
	"github.com/bujupah/excel/pkg/src/csvsql"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	_ "github.com/mithrandie/csvq-driver"
	"net/http"
	"path/filepath"
	"time"
)

// Make sure Datasource implements required interfaces. This is important to do
// since otherwise we will only get a not implemented error response from plugin in
// runtime. In this example datasource instance implements backend.QueryDataHandler,
// backend.CheckHealthHandler interfaces. Plugin should not implement all these
// interfaces- only those which are required for a particular task.
var (
	_ backend.QueryDataHandler      = (*Datasource)(nil)
	_ backend.CheckHealthHandler    = (*Datasource)(nil)
	_ backend.CallResourceHandler   = (*Datasource)(nil)
	_ instancemgmt.InstanceDisposer = (*Datasource)(nil)
)

// NewDatasource creates a new datasource instance.
func NewDatasource(_ backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	return &Datasource{}, nil
}

// Datasource is an example datasource which can respond to data queries, reports
// its health and has streaming skills.
type Datasource struct {
}

// Dispose here tells plugin SDK that plugin wants to clean up resources when a new instance
// created. As soon as datasource settings change detected by SDK old datasource instance will
// be disposed and a new one will be created using NewSampleDatasource factory function.
func (d *Datasource) Dispose() {
	// Clean up datasource instance resources.
}

// QueryData handles multiple queries and returns multiple responses.
// req contains the queries []DataQuery (where each query contains RefID as a unique identifier).
// The QueryDataResponse contains a map of RefID to the response for each query, and each response
// contains Frames ([]*Frame).
func (d *Datasource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	// create response struct
	response := backend.NewQueryDataResponse()

	// loop over queries and execute them individually.
	for _, q := range req.Queries {
		res := d.query(ctx, req.PluginContext, q)

		// save the response in a hashmap
		// based on with RefID as identifier
		response.Responses[q.RefID] = res
	}

	return response, nil
}

func (d *Datasource) query(ctx context.Context, pCtx backend.PluginContext, query backend.DataQuery) backend.DataResponse {
	logger := log.New().With("refId", query.RefID)

	var response backend.DataResponse

	// Unmarshal the JSON into our queryModel.
	var qm models.QueryModel

	err := json.Unmarshal(query.JSON, &qm)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("json unmarshal: %v", err.Error()))
	}

	jsonData, _ := pCtx.DataSourceInstanceSettings.JSONData.MarshalJSON()
	secureJsonData := pCtx.DataSourceInstanceSettings.DecryptedSecureJSONData
	setting, err := GetDatasourceSettings(jsonData, secureJsonData)

	uid := pCtx.DataSourceInstanceSettings.UID
	version := fmt.Sprintf("%d", pCtx.DataSourceInstanceSettings.Updated.Unix())

	s, err := csvsql.New(pCtx.OrgID, uid, version, func(dsPath string) error {
		ftp, err := go4ftp.NewInstance(go4ftp.ConnConfig{
			Protocol:      setting.Access,
			Host:          setting.Host,
			Port:          22,
			User:          setting.Username,
			Password:      setting.Password,
			Timeout:       10 * time.Second,
			IgnoreHostKey: setting.IgnoreHostKey,
		})
		if err != nil {
			return nil
		}

		for _, path := range setting.Paths {
			entries, _ := ftp.Read(path)
			for _, entry := range entries {
				if entry.Size > 5*1024*1024 {
					logger.Warn("file size is too big", "file", entry.Name, "size", entry.Size)
					continue
				}

				if setting.Target == "folder" {
					source := filepath.Join(path, entry.Name)
					target := filepath.Join(dsPath, entry.Name)
					logger.Info("downloading file", "source", source, "target", target)
					if err := ftp.DownloadFile(source, target); err != nil {
						logger.Error("failed to download", err)
						continue
					}
					continue
				}
			}
		}

		logger.Info("database location", "path", dsPath)
		//return ftp.Close
		return nil
	})

	if err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, err.Error())
	}

	defer func(s *csvsql.Database) {
		if err := s.Close(); err != nil {
			logger.Error("Failed to close database connection", err)
		}
	}(s)

	frame := data.NewFrame("response")

	logger.Info("Running query", "query", qm.RawSql)
	frame, err = s.RunQuery(ctx, qm)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, err.Error())
	}

	// add the frames to the response.
	response.Frames = append(response.Frames, frame)

	return response
}

// CheckHealth handles health checks sent from Grafana to the plugin.
// The main use case for these health checks is the test button on the
// datasource configuration page which allows users to verify that
// a datasource is working as expected.
func (d *Datasource) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	jsonData, _ := req.PluginContext.DataSourceInstanceSettings.JSONData.MarshalJSON()
	secureJsonData := req.PluginContext.DataSourceInstanceSettings.DecryptedSecureJSONData

	setting, err := GetDatasourceSettings(jsonData, secureJsonData)
	if err != nil {
		return &backend.CheckHealthResult{
			Status:      backend.HealthStatusError,
			Message:     "Failed to parse datasource settings",
			JSONDetails: []byte(ToErrorJson(err.Error())),
		}, nil
	}

	result := Ping(ctx, setting)
	if result.Error != "" {
		return &backend.CheckHealthResult{
			Status:      backend.HealthStatusError,
			Message:     result.Error,
			JSONDetails: []byte(ToErrorJson(err.Error())),
		}, nil
	}

	return &backend.CheckHealthResult{
		Status:  backend.HealthStatusOk,
		Message: result.Message,
	}, nil
}

// CallResource is called when a client sends a sync request to the plugin. This callback
// allows sending the first message.
func (d *Datasource) CallResource(ctx context.Context, req *backend.CallResourceRequest, sender backend.CallResourceResponseSender) error {
	response := &backend.CallResourceResponse{}

	if req.Path == "tables" {
		uid := req.PluginContext.DataSourceInstanceSettings.UID
		tables := csvsql.GetTables(uid, req.PluginContext.OrgID)
		body, _ := json.Marshal(tables)
		response.Body = body
		response.Status = http.StatusOK
		return sender.Send(response)
	}

	if req.Path == "" || req.Method == "GET" {
		response.Status = http.StatusOK
		response.Body = []byte("{\"message\":\"" + "datasource is running" + "\"}")
		return sender.Send(response)
	}

	if req.Path != "ping" && req.Path != "check" {
		err := fmt.Errorf("unsupported path %s", req.Path)
		response.Status = http.StatusBadRequest
		response.Body = []byte("{\"message\":\"" + err.Error() + "\"}")
		return sender.Send(response)
	}

	jsonData := req.Body
	secureJsonData := req.PluginContext.DataSourceInstanceSettings.DecryptedSecureJSONData

	setting, err := GetDatasourceSettings(jsonData, secureJsonData)
	if err != nil {
		body, _ := json.Marshal(struct {
			Message string `json:"message"`
			Status  int    `json:"status"`
			Error   string `json:"error"`
		}{
			Message: "Failed to parse payload",
			Status:  400,
			Error:   err.Error(),
		})
		response.Body = body
		response.Status = 400
		return sender.Send(response)
	}

	if req.Path == "ping" {
		result := Ping(ctx, setting)
		body, _ := json.Marshal(result)
		response.Body = body
		response.Status = result.Status
		return sender.Send(response)
	}

	if req.Path == "check" {
		result := Check(ctx, setting)
		body, _ := json.Marshal(result)
		response.Body = body
		response.Status = result.Status
		return sender.Send(response)
	}

	return nil
}
