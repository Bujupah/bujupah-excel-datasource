import { DataQuery } from '@grafana/schema';
import { DataSourceJsonData } from '@grafana/data';

export type ColumnType = 'number' | 'string' | 'datetime' | 'json';
export type AccessType = 'sftp' | 'ftp';
export type TargetType = 'folder' | 'file' | 'files';

export interface MyQuery extends DataQuery {
  rawSql?: string;
  columnsType?: Array<{
    name: string;
    type: ColumnType;
  }>;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  rawSql: 'SELECT 1',
  columnsType: [],
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  access: AccessType;

  delimiter: string;
  comment: string;
  trimLeadingSpace: boolean;

  target: TargetType;
  path: string[];
  host: string;
  port: number;
  ignoreHostKey: boolean;
  username: string;

  age: number;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  password: string;
}
