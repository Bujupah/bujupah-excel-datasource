import { css } from '@emotion/css';
import React, { useState } from 'react';
import { useMeasure } from 'react-use';
import AutoSizer from 'react-virtualized-auto-sizer';

import { GrafanaTheme2 } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { Button, HorizontalGroup, Modal, useStyles2, useTheme2 } from '@grafana/ui';

import { QueryEditorProps } from './types';

import { QueryEditorRaw } from './QueryEditorRaw';
import { QueryToolbox } from './QueryToolbox';
import { MyQuery } from 'types';
import { EditorHeader, FlexItem } from '@grafana/experimental';
import { LLMEditor } from './LLMEditor';

interface RawEditorProps extends Omit<QueryEditorProps, 'onChange'> {
  isRunning: boolean;
  onRunQuery: () => void;
  onChange: (q: MyQuery, processQuery: boolean) => void;
}

export function RawEditor({ query, onChange, onRunQuery, isRunning }: RawEditorProps) {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const [isExpanded, setIsExpanded] = useState(false);
  const [toolboxRef, toolboxMeasure] = useMeasure<HTMLDivElement>();
  const [editorRef, editorMeasure] = useMeasure<HTMLDivElement>();

  const renderQueryEditor = (width?: number, height?: number) => {
    return (
      <>
        <EditorHeader>
          <HorizontalGroup align="center" justify="space-between">
            <LLMEditor
              onReply={(reply) => {
                console.log(reply);
              }}
            />
            <FlexItem grow={1} />
            <Button icon="play" variant="primary" size="sm" onClick={() => onRunQuery()} disabled={isRunning}>
              Run query
            </Button>
          </HorizontalGroup>
        </EditorHeader>
        <QueryEditorRaw
          editorLanguageDefinition={{
            id: 'sql',
          }}
          query={query}
          width={width}
          height={height ? height - toolboxMeasure.height : undefined}
          onChange={onChange}
        >
          {({ formatQuery }) => {
            return (
              <div ref={toolboxRef}>
                <QueryToolbox showTools onFormatCode={formatQuery} onExpand={setIsExpanded} isExpanded={isExpanded} />
              </div>
            );
          }}
        </QueryEditorRaw>
      </>
    );
  };

  const renderEditor = (standalone = false) => {
    return standalone ? (
      <AutoSizer>
        {({ width, height }: any) => {
          return renderQueryEditor(width, height);
        }}
      </AutoSizer>
    ) : (
      <div ref={editorRef}>{renderQueryEditor()}</div>
    );
  };

  const renderPlaceholder = () => {
    return (
      <div
        style={{
          width: editorMeasure.width,
          height: editorMeasure.height,
          background: theme.colors.background.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Editing in expanded code editor
      </div>
    );
  };

  return (
    <>
      {isExpanded ? renderPlaceholder() : renderEditor()}
      {isExpanded && (
        <Modal
          title={`Query ${query.refId}`}
          closeOnBackdropClick={false}
          closeOnEscape={false}
          className={styles.modal}
          contentClassName={styles.modalContent}
          isOpen={isExpanded}
          onDismiss={() => {
            reportInteraction('grafana_sql_editor_expand', {
              datasource: query.datasource?.type,
              expanded: false,
            });
            setIsExpanded(false);
          }}
        >
          {renderEditor(true)}
        </Modal>
      )}
    </>
  );
}

function getStyles(theme: GrafanaTheme2) {
  return {
    modal: css`
      width: 95vw;
      height: 95vh;
    `,
    modalContent: css`
      height: 100%;
      padding-top: 0;
    `,
  };
}
