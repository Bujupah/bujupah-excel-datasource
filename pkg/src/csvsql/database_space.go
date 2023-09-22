package csvsql

import (
	"github.com/bujupah/excel/pkg/src/constants"
	"os"
)

func CreateSpace(dsUid string, tenantId int64) (string, bool, error) {
	dbPath := constants.TenantDatasourceFolder(dsUid, tenantId)
	_, err := os.Stat(dbPath)
	if err != nil {
		if os.IsNotExist(err) {
			if err := os.MkdirAll(dbPath, os.ModePerm); err != nil {
				return "", false, err
			}
			logger.Info("Space is created", "path", dbPath)
			return dbPath, true, nil
		} else {
			logger.Error("Error while checking if space exists", err)
			return "", false, err
		}
	}
	logger.Info("Space already exist", "path", dbPath)
	return dbPath, false, nil
}
