import React from 'react';

import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';
import { RawEditor } from './query-editor/RawEditor';
import { LoadingState } from '@grafana/schema';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery, data }: Props) {
  return (
    <RawEditor
      query={query}
      isRunning={data?.state === LoadingState.Loading}
      onChange={(q, p) => {
        onChange(q);
        if (p) {
          onRunQuery();
        }
      }}
      onRunQuery={onRunQuery}
    />
  );
}
