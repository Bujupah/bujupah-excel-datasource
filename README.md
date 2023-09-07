<!-- This README file is going to be the one displayed on the Grafana.com website for your plugin. Uncomment and replace the content here before publishing.

Remove any remaining comments before publishing as these may be displayed on Grafana.com -->
# BMC Excel Datasource

[![CI](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/ci.yml/badge.svg)](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/ci.yml)
[![Docs](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/jekyll-gh-pages.yml/badge.svg)](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/jekyll-gh-pages.yml)
[![Latest Grafana API Compatibility Check](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/is-compatible.yml/badge.svg)](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/is-compatible.yml)
[![Release](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/release.yml/badge.svg)](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/release.yml)

<img src="src/img/logo.png" width=50 alt="Excel Datasource Logo"/>

Load multiple csv/excel files data into grafana's dashboards from ftp/sftp servers.

## Overview / Introduction

### Config Editor

![Config Editor](src/img/config_editor.png)

## Requirements

- S/FTP server with access to the csv files
- Grafana 7.0+

## Features

- Load multiple csv/xlsx files from ftp server.
- Load multiple csv/xlsx files located in a folder from ftp server automatically.
- Query data from multiple csv/xlsx files using sql like syntax.
- Query data from multiple csv/xlsx files using grafana variables.
- Join data from multiple csv/xlsx files using sql like syntax.
- Rich query editor with syntax highlighting.
- Rich query editor with autocomplete.
- Rich query editor with query validation.
- Rich query editor with query formatting.

## Todo

- [x] Load multiple csv/xlsx files from ftp server.
- [x] Load multiple csv/xlsx files located in a folder from ftp server automatically.
- [x] Query data from multiple csv/xlsx files using sql like syntax.
- [ ] Query data from multiple csv/xlsx files using grafana variables.
- [ ] Join data from multiple csv/xlsx files using sql like syntax.
- [x] Rich query editor with syntax highlighting.
- [x] Rich query editor with autocomplete.
- [ ] Rich query editor with query validation.
- [ ] Rich query editor with query formatting.
- [ ] Secured multi tenancy.

## Documentation

If your project has dedicated documentation available for users, provide links here. For help in following Grafana's style recommendations for technical documentation, refer to our [Writer's Toolkit](https://grafana.com/docs/writers-toolkit/).

## Contributing

Do you want folks to contribute to the plugin or provide feedback through specific means? If so, tell them how!
