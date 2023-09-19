<!-- This README file is going to be the one displayed on the Grafana.com website for your plugin. Uncomment and replace the content here before publishing.

Remove any remaining comments before publishing as these may be displayed on Grafana.com -->
# CSV/SQL Datasource (under development)

[![CI](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/ci.yml/badge.svg)](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/ci.yml)
[![Docs](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/jekyll-gh-pages.yml/badge.svg)](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/jekyll-gh-pages.yml)
[![Latest Grafana API Compatibility Check](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/is-compatible.yml/badge.svg)](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/is-compatible.yml)
[![Release](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/release.yml/badge.svg)](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/release.yml)

<img src="https://github.com/Bujupah/bujupah-excel-datasource/raw/master/src/img/logo.png" width=50 alt="Excel Datasource Logo"/>

Load multiple csv/excel files data into grafana's dashboards from ftp/sftp servers.

## Overview / Introduction

### Config Editor

![Config Editor](https://github.com/Bujupah/bujupah-excel-datasource/raw/master/src/img/config_editor.png)

## Requirements

- Grafana 9.0+
- FTP or SFTP server
- [Grafana LLM app](https://github.com/grafana/grafana-llm-app) - optional

## Features

- Server Health check.
- Files health check.
- Support multiple formats such as CSV, TSV, LTSV, Fixed-Length Format, JSON and JSON Lines.
- Auto-detect supported files.
- Data joins between multiple files.
- Support grafana variables.
- SQL query editor in fullscreen
- SQL-like query language.
- SQL syntax highlighting.
- SQL autocomplete.
- SQL validation.
- SQL formatting.

## Todo

- [x] Server Health check.
- [x] Files health check.
- [ ] Support CSV.
- [ ] Support TSV.
- [ ] Support LTSV.
- [ ] Support Fixed-Length Format.
- [ ] Support JSON.
- [ ] Support JSON Lines.
- [ ] Auto-detect supported files.
- [ ] Data joins between multiple files.
- [x] Support grafana variables.
- [x] SQL query editor in fullscreen.
- [ ] SQL-like query language.
- [ ] SQL syntax highlighting.
- [ ] SQL autocomplete.
- [ ] SQL validation.
- [ ] SQL formatting.
- [ ] SQL formatting.

## Documentation

If your project has dedicated documentation available for users, provide links here. For help in following Grafana's style recommendations for technical documentation, refer to our [Writer's Toolkit](https://grafana.com/docs/writers-toolkit/).

## Contributing

Do you want folks to contribute to the plugin or provide feedback through specific means? If so, tell them how!
