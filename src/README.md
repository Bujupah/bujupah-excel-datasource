<!-- This README file is going to be the one displayed on the Grafana.com website for your plugin. Uncomment and replace the content here before publishing.

Remove any remaining comments before publishing as these may be displayed on Grafana.com -->
# BMC Excel Datasource

[![CI](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/ci.yml/badge.svg)](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/ci.yml)
[![Docs](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/jekyll-gh-pages.yml/badge.svg)](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/jekyll-gh-pages.yml)
[![Latest Grafana API Compatibility Check](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/is-compatible.yml/badge.svg)](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/is-compatible.yml)
[![Release](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/release.yml/badge.svg)](https://github.com/Bujupah/bmc-excel-datasource/actions/workflows/release.yml)

<img src="img/logo.png" width=50 alt="Excel Datasource Logo"/>

Load multiple csv/excel files data into grafana's dashboards from ftp/sftp servers.

## Overview / Introduction

### Config Editor

![Config Editor](img/config_editor.png)

## Requirements

- S/FTP server with access to the csv files
- Grafana 7.0+

## Features

- Server Health check.
- Files health check.
- Support multiple formats such as CSV, TSV, LTSV, Fixed-Length Format, JSON and JSON Lines.
- Auto-detect supported files.
- SQL-like query language.
- Data joins between multiple files.
- Support grafana variables.
- SQL syntax highlighting.
- SQL autocomplete.
- SQL validation.
- SQL formatting.

## Todo

- [ ] Server Health check.
- [ ] Files health check.
- [ ] Support CSV.
- [ ] Support TSV.
- [ ] Support LTSV.
- [ ] Support Fixed-Length Format.
- [ ] Support JSON.
- [ ] Support JSON Lines.
- [ ] Auto-detect supported files.
- [ ] SQL-like query language.
- [ ] Data joins between multiple files.
- [ ] Support grafana variables.
- [ ] SQL syntax highlighting.
- [ ] SQL autocomplete.
- [ ] SQL validation.
- [ ] SQL formatting.

## Documentation

If your project has dedicated documentation available for users, provide links here. For help in following Grafana's style recommendations for technical documentation, refer to our [Writer's Toolkit](https://grafana.com/docs/writers-toolkit/).

## Contributing

Do you want folks to contribute to the plugin or provide feedback through specific means? If so, tell them how!
<!-- To help maximize the impact of your README and improve usability for users, we propose the following loose structure:

**BEFORE YOU BEGIN**
- Ensure all links are absolute URLs so that they will work when the README is displayed within Grafana and Grafana.com
- Be inspired ✨ 
  - [grafana-polystat-panel](https://github.com/grafana/grafana-polystat-panel)
  - [volkovlabs-variable-panel](https://github.com/volkovlabs/volkovlabs-variable-panel)

**ADD SOME BADGES**

Badges convey useful information at a glance for users whether in the Catalog or viewing the source code. You can use the generator on [Shields.io](https://shields.io/badges/dynamic-json-badge) together with the Grafana.com API 
to create dynamic badges that update automatically when you publish a new version to the marketplace.

- For the logo field use 'grafana'.
- Examples (label: query)
  - Downloads: $.downloads
  - Catalog Version: $.version
  - Grafana Dependency: $.grafanaDependency
  - Signature Type: $.versionSignatureType

Full example: ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/grafana-polystat-panel&label=Marketplace&prefix=v&color=F47A20)

Consider other [badges](https://shields.io/badges) as you feel appropriate for your project.

## Overview / Introduction
Provide one or more paragraphs as an introduction to your plugin to help users understand why they should use it.  

Consider including screenshots:
- in [plugin.json](https://grafana.com/docs/grafana/latest/developers/plugins/metadata/#info) include them as relative links.
- in the README ensure they are absolute URLs.

## Requirements
List any requirements or dependencies they may need to run the plugin.

## Getting Started
Provide a quick start on how to configure and use the plugin.

## Documentation
If your project has dedicated documentation available for users, provide links here. For help in following Grafana's style recommendations for technical documentation, refer to our [Writer's Toolkit](https://grafana.com/docs/writers-toolkit/).

## Contributing
Do you want folks to contribute to the plugin or provide feedback through specific means? If so, tell them how!
-->