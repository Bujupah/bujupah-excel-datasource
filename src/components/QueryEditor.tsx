import React from 'react';

import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';
import { RawEditor } from './query-editor/RawEditor';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  return (
    <RawEditor
      query={query}
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
