package plugin

import (
	"context"
	"encoding/json"
	"github.com/Bujupah/go4ftp"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"net/http"
	"strings"
	"time"
)

type Result struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Error   string      `json:"error"`
}

type PingPayload struct {
	Username      string `json:"username"`
	Password      string `json:"password"`
	Access        string `json:"access"`
	Host          string `json:"host"`
	Port          int    `json:"port"`
	Secure        bool   `json:"secure"`
	IgnoreHostKey bool   `json:"ignoreHostKey"`
}

type CheckPayload struct {
	PingPayload
	Target string   `json:"target"`
	Paths  []string `json:"path"`
}

func Ping(_ context.Context, req *backend.CallResourceRequest) *Result {
	// This function is empty. It is here to make sure that
	// the package is imported and the code is executed.
	cmd := &PingPayload{}

	if err := json.Unmarshal(req.Body, cmd); err != nil {
		return &Result{
			Message: "Failed to parse payload",
			Status:  400,
			Error:   err.Error(),
		}
	}

	if cmd.Secure {
		cmd.Password = req.PluginContext.DataSourceInstanceSettings.DecryptedSecureJSONData["password"]
	}

	instance, err := go4ftp.NewInstance(go4ftp.ConnConfig{
		Protocol:      cmd.Access,
		Host:          cmd.Host,
		Port:          cmd.Port,
		User:          cmd.Username,
		Password:      cmd.Password,
		IgnoreHostKey: cmd.IgnoreHostKey,
		Timeout:       10 * time.Second,
	})

	if err != nil {
		return &Result{
			Message: "Failed to create FTP instance",
			Status:  500,
			Error:   err.Error(),
		}
	}

	err = instance.Ping()
	if err != nil {
		return &Result{
			Message: "Failed to ping FTP server",
			Status:  504,
			Error:   err.Error(),
		}
	}

	return &Result{
		Message: "Successfully connected to FTP server",
		Status:  200,
		Error:   "",
	}
}

func Check(_ context.Context, req *backend.CallResourceRequest) *Result {
	logger := log.New()

	cmd := &CheckPayload{}

	if err := json.Unmarshal(req.Body, cmd); err != nil {
		return &Result{
			Status:  http.StatusBadRequest,
			Message: "Failed to parse payload",
			Error:   err.Error(),
		}
	}

	if cmd.Secure {
		cmd.Password = req.PluginContext.DataSourceInstanceSettings.DecryptedSecureJSONData["password"]
	}

	if len(cmd.Paths) == 0 {
		return &Result{
			Status:  http.StatusBadRequest,
			Message: "No paths specified",
			Error:   "No paths specified",
		}
	}

	instance, err := go4ftp.NewInstance(go4ftp.ConnConfig{
		Protocol:      cmd.Access,
		Host:          cmd.Host,
		Port:          cmd.Port,
		User:          cmd.Username,
		Password:      cmd.Password,
		IgnoreHostKey: cmd.IgnoreHostKey,
		Timeout:       10 * time.Second,
	})

	if err != nil {
		return &Result{
			Message: "Failed to create FTP instance",
			Status:  http.StatusInternalServerError,
			Error:   err.Error(),
		}
	}

	logger.Info("Successfully created FTP instance", "target", cmd.Target, "paths", cmd.Paths)

	result := make([]go4ftp.Entries, 0)
	if cmd.Target == "folder" {
		result, err = instance.Read(cmd.Paths[0])
		if err != nil {
			return &Result{
				Status:  http.StatusGatewayTimeout,
				Message: "Failed to read from FTP server",
				Error:   err.Error(),
			}
		}
	}

	if cmd.Target == "file" {
		result, err = instance.Read(cmd.Paths[0])
		if err != nil {
			return &Result{
				Status:  http.StatusGatewayTimeout,
				Message: "Failed to read from FTP server",
				Error:   err.Error(),
			}
		}
	}

	if cmd.Target == "files" {
		for _, path := range cmd.Paths {
			data, err := instance.Read(path)
			if err != nil {
				return &Result{
					Status:  http.StatusGatewayTimeout,
					Message: "Failed to read from FTP server",
					Error:   err.Error(),
				}
			}
			result = append(result, data...)
		}
	}

	filteredResult := make([]go4ftp.Entries, 0)
	for _, row := range result {
		canAppend := strings.Contains(row.Name, ".csv")
		if canAppend {
			filteredResult = append(filteredResult, row)
		}
	}

	if len(filteredResult) == 0 {
		return resultEmptyError(cmd.Target, cmd.Paths[0])
	}

	return &Result{
		Status:  http.StatusOK,
		Message: "Successfully pinged ftp server",
		Data:    filteredResult,
	}
}

func resultEmptyError(target, filepath string) *Result {
	if target == "file" || target == "files" {
		return &Result{
			Status:  http.StatusNotFound,
			Message: "File does not exist with the specified path",
			Error:   "File does not exist with the specified path",
			Data:    filepath,
		}
	}

	if target == "file" {
		return &Result{
			Status:  http.StatusNotFound,
			Message: "No files found in the specified folder",
			Error:   "No files found in the specified folder",
			Data:    filepath,
		}
	}

	return nil
}
