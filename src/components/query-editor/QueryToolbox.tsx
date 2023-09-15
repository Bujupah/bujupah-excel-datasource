import { css } from '@emotion/css';
import React, { useMemo } from 'react';

import { HorizontalGroup, Icon, IconButton, Tooltip, useTheme2 } from '@grafana/ui';

interface QueryToolboxProps extends Omit<any, 'onValidate'> {
  showTools?: boolean;
  isExpanded?: boolean;
  onFormatCode?: () => void;
  onExpand?: (expand: boolean) => void;
}

export function QueryToolbox({ showTools, onFormatCode, onExpand, isExpanded, ...validatorProps }: QueryToolboxProps) {
  const theme = useTheme2();

  const styles = useMemo(() => {
    return {
      container: css`
        border: 1px solid ${theme.colors.border.medium};
        border-top: none;
        padding: ${theme.spacing(0.5, 0.5, 0.5, 0.5)};
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        font-size: ${theme.typography.bodySmall.fontSize};
      `,
      error: css`
        color: ${theme.colors.error.text};
        font-size: ${theme.typography.bodySmall.fontSize};
        font-family: ${theme.typography.fontFamilyMonospace};
      `,
      valid: css`
        color: ${theme.colors.success.text};
      `,
      info: css`
        color: ${theme.colors.text.secondary};
      `,
      hint: css`
        color: ${theme.colors.text.disabled};
        white-space: nowrap;
        cursor: help;
      `,
    };
  }, [theme]);


  return (
    <div className={styles.container}>
      {showTools && (
        <HorizontalGroup spacing="sm" justify='flex-end'>
          {onFormatCode && (
            <IconButton
              onClick={() => {
                onFormatCode();
              }}
              name="brackets-curly"
              size="xs"
              tooltip="Format query"
            />
          )}
          {onExpand && (
            <IconButton
              onClick={() => {
                onExpand(!isExpanded);
              }}
              name={isExpanded ? 'times' : 'expand-arrows'}
              size="xs"
              tooltip={isExpanded ? 'Collapse editor' : 'Expand editor'}
            />
          )}
          <Tooltip content="Hit CTRL/CMD+Return to run query">
            <Icon className={styles.hint} name="keyboard" />
          </Tooltip>
        </HorizontalGroup>
      )}
    </div>
  );
}
