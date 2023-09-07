import { DataSourceInstanceSettings, CoreApp } from '@grafana/data';
import { DataSourceWithBackend } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY } from './types';

export class DataSource extends DataSourceWithBackend<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return DEFAULT_QUERY;
  }

  annotationQuery(options: any): Promise<any[]> {
    return new Promise((resolve, _) => {
      resolve([]);
    });
  }

  async metricFindQuery?(query: MyQuery, options: Record<string, any>): Promise<any[]> {
    return new Promise((resolve, _) => {
      resolve([]);
    });
  }
}
