package main

import (
	"github.com/bujupah/excel/pkg/plugin"
	"github.com/bujupah/excel/pkg/src/constants"
	"os"

	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"

	_ "github.com/mithrandie/csvq-driver"
)

func main() {
	if err := datasource.Manage(constants.PluginID, plugin.NewDatasource, datasource.ManageOpts{}); err != nil {
		log.DefaultLogger.Error(err.Error())
		os.Exit(1)
	}
}
