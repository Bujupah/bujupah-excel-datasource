<!-- This README file is going to be the one displayed on the Grafana.com website for your plugin. Uncomment and replace the content here before publishing.

Remove any remaining comments before publishing as these may be displayed on Grafana.com -->
# Excel Datasource

[![CI](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/ci.yml/badge.svg)](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/ci.yml)
[![Docs](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/jekyll-gh-pages.yml/badge.svg)](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/jekyll-gh-pages.yml)
[![Latest Grafana API Compatibility Check](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/is-compatible.yml/badge.svg)](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/is-compatible.yml)
[![Release](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/release.yml/badge.svg)](https://github.com/Bujupah/bujupah-excel-datasource/actions/workflows/release.yml)

<img src="https://github.com/Bujupah/bujupah-excel-datasource/raw/master/src/img/logo.png" width=50 alt="Excel Datasource Logo"/>

Load multiple csv/excel files data into grafana's dashboards from ftp/sftp servers.

## Features

- Server Health check.
- Files health check.
- Support multiple formats such as CSV, TSV, LTSV, Fixed-Length Format, JSON and JSON Lines.
- Auto-detect supported files.
- Data joins between multiple files.
- SQL like query language.
- SQL query editor in fullscreen.
- SQL syntax highlighting.
- SQL autocomplete.
- SQL validation.
- SQL formatting.
- Support grafana variables.
- Support LLM - Text to SQL using OpenAI.

## Limitations
- Every column type is string - no type casting. (Workaround: you can use grafana transformation to make this work)

## Documentation

Todo

## Contributing

If you're interested in contributing to this project, please take a look at our [contribution docs](https://github.com/bujupah/bujupah-excel-datasource/blob/master/CONTRIBUTING.md) before getting started.
