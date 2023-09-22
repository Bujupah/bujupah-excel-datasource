package constants

import (
	"fmt"
	"path/filepath"
)

const PluginID = "bujupah-csv-datasource"
const pluginFolder = "data/ds/bujupah-csv-datasource"

func TenantDatasourceFolder(dsUid string, tenantId int64) string {
	tenantFolder := fmt.Sprintf("tenant_%d", tenantId)
	return filepath.Join(pluginFolder, tenantFolder, dsUid)
}
