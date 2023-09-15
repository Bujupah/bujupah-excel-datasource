import {
  DataSourceJsonData,
  SelectableValue,
  TimeRange,
  toOption as toOptionFromData,
} from '@grafana/data';
import { MyQuery } from 'types';


export interface SqlQueryForInterpolation {
  dataset?: string;
  alias?: string;
  format?: QueryFormat;
  rawSql?: string;
  refId: string;
  hide?: boolean;
}

export interface SQLConnectionLimits {
  maxOpenConns: number;
  maxIdleConns: number;
  maxIdleConnsAuto: boolean;
  connMaxLifetime: number;
}

export interface SQLOptions extends SQLConnectionLimits, DataSourceJsonData {
  tlsAuth: boolean;
  tlsAuthWithCACert: boolean;
  timezone: string;
  tlsSkipVerify: boolean;
  user: string;
  database: string;
  url: string;
  timeInterval: string;
}

export enum QueryFormat {
  Timeseries = 'time_series',
  Table = 'table',
}

export interface NameValue {
  name: string;
  value: string;
}

export type SQLFilters = NameValue[];


export interface TableSchema {
  name?: string;
  schema?: TableFieldSchema[];
}

export interface TableFieldSchema {
  name: string;
  description?: string;
  type: string;
  repeated: boolean;
  schema: TableFieldSchema[];
}

export interface QueryRowFilter {
  filter: boolean;
  group: boolean;
  order: boolean;
  preview: boolean;
}

const backWardToOption = (value: string) => ({ label: value, value });

export const toOption = toOptionFromData ?? backWardToOption;

export interface ResourceSelectorProps {
  disabled?: boolean;
  className?: string;
  applyDefault?: boolean;
}
// React Awesome Query builder field types.
// These are responsible for rendering the correct UI for the field.
export type RAQBFieldTypes = 'text' | 'number' | 'boolean' | 'datetime' | 'date' | 'time';

export interface SQLSelectableValue extends SelectableValue {
  type?: string;
  raqbFieldType?: RAQBFieldTypes;
}

export interface QueryEditorProps {
  query: MyQuery;
  onChange: (query: MyQuery) => void;
  range?: TimeRange;
}
