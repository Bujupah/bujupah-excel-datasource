package csvsql

import (
	"github.com/bujupah/excel/pkg/src/constants"
	"os"
	"path/filepath"
)

func VerifyVersion(tenantId int64, dbUid string, dbVersion string) (bool, string, error) {
	versionPath := filepath.Join(constants.TenantDatasourceFolder(dbUid, tenantId), ".version")
	logger.Info("Checking version", "path", versionPath)

	if _, err := os.Stat(versionPath); err != nil {
		if err := WriteVersion(tenantId, dbUid, dbVersion); err != nil {
			logger.Error("Error writing version", err)
			return false, dbVersion, err
		}
		logger.Info("Updated database to a new version")
		return true, dbVersion, nil
	}

	logger.Info("Found an existing database version")
	bytes, err := os.ReadFile(versionPath)
	if err != nil {
		return false, "", err
	}

	logger.Info("Comparing database version with datasource version")
	localVersion := string(bytes)
	shouldUpdate := dbVersion != localVersion

	if shouldUpdate {
		if err := WriteVersion(tenantId, dbUid, dbVersion); err != nil {
			logger.Error("Failed to update database", err)
			return false, dbVersion, err
		}
	}

	return shouldUpdate, localVersion, nil
}

func WriteVersion(tenantId int64, dbUid string, version string) error {
	versionPath := filepath.Join(constants.TenantDatasourceFolder(dbUid, tenantId), ".version")

	logger.Info("Writing a new version", "version", version, "path", versionPath)

	if err := os.Remove(versionPath); err != nil {
		logger.Error("Failed to remove old version", err)
	}

	return os.WriteFile(versionPath, []byte(version), os.ModePerm)
}
