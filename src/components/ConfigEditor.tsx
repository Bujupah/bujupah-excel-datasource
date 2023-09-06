import React, { ChangeEvent, useEffect } from 'react';
import { InlineField, RadioButtonGroup, SecretInput, Input, InlineSwitch, HorizontalGroup, Button, Badge, Spinner } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { AccessType, MyDataSourceOptions, MySecureJsonData, TargetType } from '../types';
import { ping } from '../services/backend';

import SectionHeader from './widgets/SectionHeader'

import { ftpTargetOptions, accessTypeOptions } from './constants'

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> { }

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const [init, setInit] = React.useState<boolean>(false)

  const [pingResult, setPingResult] = React.useState<boolean | undefined>(undefined)
  const [isPinging, setIsPinging] = React.useState(false)
  const [isPulling, setIsChecking] = React.useState(false)

  const { jsonData, secureJsonFields } = options;
  const secureJsonData = (options.secureJsonData || {}) as MySecureJsonData;

  useEffect(() => {
    const pathIsEmpty = !jsonData.path || jsonData.path.length === 0
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      path: pathIsEmpty ? [''] : jsonData.path,
      target: jsonData.target ?? 'files',
      access: jsonData.access ?? 'sftp'
    };
    onPing()
    onOptionsChange({ ...options, jsonData: data });
    setInit(true);
  }, [])


  const onAccessTypeChange = (item: AccessType) => {
    const jsonData: MyDataSourceOptions = {
      ...options.jsonData,
      access: item,
    };
    onOptionsChange({ ...options, jsonData });
  };

  const onTargetTypeChange = (item: TargetType) => {
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      target: item!,
      path: [''],
    };
    onOptionsChange({ ...options, jsonData: data });
  };

  const onDelimiterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      delimiter: event.target.value,
    };
    onOptionsChange({ ...options, jsonData: data });
  };

  const onCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      comment: event.target.value,
    };
    onOptionsChange({ ...options, jsonData: data });
  };

  const onTrimLeadingSpaceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      trimLeadingSpace: event.target.checked || !!event.target.value,
    };
    onOptionsChange({ ...options, jsonData: data });
  };

  const onIgnoreHostKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      ignoreHostKey: event.target.checked || !!event.target.value,
    };
    onOptionsChange({ ...options, jsonData: data });
  };

  const onHostChange = (event: ChangeEvent<HTMLInputElement>) => {
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      host: event.target.value,
    };
    onOptionsChange({ ...options, jsonData: data });
  };

  const onPortChange = (event: ChangeEvent<HTMLInputElement>) => {
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      port: +event.target.value,
    };
    onOptionsChange({ ...options, jsonData: data });
  };

  const onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      username: event.target.value,
    };
    onOptionsChange({ ...options, jsonData: data });
  };

  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      secureJsonData: {
        password: event.target.value,
      },
    });
  };

  const onResetPassword = () => {
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        password: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        password: '',
      },
    });
  };


  const onFilePathChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData: MyDataSourceOptions = {
      ...options.jsonData,
      path: [event.target.value],
    };
    onOptionsChange({ ...options, jsonData });
  }

  const onAgeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      age: +event.target.value,
    };
    onOptionsChange({ ...options, jsonData: data });
  };

  const onFilePathIdxChange = (event: ChangeEvent<HTMLInputElement>, idx: number) => {
    const hasSamePath = jsonData.path.find((path: string) => event.target.value === path)
    if (hasSamePath) {
      jsonData.path = [...new Set(jsonData.path)]
    }

    jsonData.path[idx] = event.target.value
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      path: jsonData.path,
    };
    onOptionsChange({ ...options, jsonData: data });
  }

  const onPing = async () => {
    setIsPinging(true)
    ping().then((result) => {
      setPingResult(result)
      setIsPinging(false)
    })
  }

  const onCheck = async () => {
    setIsChecking(true)
    ping().then((result) => {
      setPingResult(result)
      setIsChecking(false)
    })
  }

  const onAddPath = () => {
    const hasAlready = jsonData.path[jsonData.path.length - 1] == ''
    if (hasAlready) {
      return
    }
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      path: [...jsonData.path, ''],
    };
    onOptionsChange({ ...options, jsonData: data });
  }

  const onRemovePath = (idx: number) => {
    const paths = jsonData.path.filter((_, i) => i !== idx)
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      path: paths,
    };
    onOptionsChange({ ...options, jsonData: data });
  }

  const renderTargetPathFields = () => {
    if (jsonData.target === 'file') {
      return <InlineField label="File" labelWidth={16} grow>
        <Input
          placeholder="Path to your csv/xlsx file"
          value={jsonData.path && jsonData.path.length > 0 ? jsonData.path[0] : ''}
          onChange={onFilePathChange}
        />
      </InlineField>
    }

    if (jsonData.target === 'folder') {
      return <InlineField label="Folder" labelWidth={16} grow>
        <Input
          placeholder="Path to your folder"
          value={jsonData.path && jsonData.path.length > 0 ? jsonData.path[0] : ''}
          onChange={onFilePathChange}
        />
      </InlineField>
    }

    return <>
      <InlineField label={`Files`} labelWidth={16} grow>
        <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
          {
            jsonData.path.map((item: string, idx) => {
              return <HorizontalGroup>
                <Input
                  key={`file_key_${idx}`}
                  placeholder="Path to your csv/xlsx file"
                  value={item}
                  width={53}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onFilePathIdxChange(e, idx)}
                />
                <Button icon='minus' variant='destructive' onClick={() => onRemovePath(idx)}></Button>
              </HorizontalGroup>
            })
          }
          <Button icon='plus' variant='secondary' onClick={onAddPath}>Add new file path</Button>
        </div>
      </InlineField>
    </>
  }


  if (!init) {
    return <Spinner />
  }

  return (
    <div className="gf-form-group">
      <SectionHeader title='Access'>
        <InlineField label="Type" labelWidth={16} grow>
          <RadioButtonGroup
            fullWidth
            options={accessTypeOptions}
            value={jsonData.access ?? 'sftp'}
            onChange={onAccessTypeChange}
          />
        </InlineField>
      </SectionHeader>

      <SectionHeader title='Options'>
        <InlineField label="Delimiter" labelWidth={16}>
          <Input
            placeholder=","
            value={jsonData.delimiter}
            onChange={onDelimiterChange}
          />
        </InlineField>
        <InlineField label="Comment" labelWidth={16}>
          <Input
            placeholder="#"
            value={jsonData.comment}
            onChange={onCommentChange}
          />
        </InlineField>
        <InlineField label="Trim leading space" labelWidth={16}>
          <InlineSwitch
            value={jsonData.trimLeadingSpace}
            onChange={onTrimLeadingSpaceChange}
          />
        </InlineField>
      </SectionHeader>
      <SectionHeader title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Connection <Badge color={
            pingResult === undefined ? 'blue' : pingResult === true ? 'green' : 'red'
          } icon='signal' text={pingResult === undefined ? 'n/a' : pingResult === true ? 'connected' : 'not connected'} />
        </div>
      }>
        <HorizontalGroup>
          <InlineField label="Host" labelWidth={16}>
            <Input
              placeholder="your.ftp.host"
              value={jsonData.host}
              onChange={onHostChange}
            />
          </InlineField>
          <InlineField label="Port" >
            <Input
              placeholder="22"
              value={jsonData.port}
              onChange={onPortChange}
            />
          </InlineField>
        </HorizontalGroup>
        <InlineField label="Ignore host key" labelWidth={16}>
          <InlineSwitch
            value={jsonData.ignoreHostKey}
            onChange={onIgnoreHostKeyChange}
          />
        </InlineField>
        <InlineField label="Username" labelWidth={16}>
          <Input
            placeholder="username"
            value={jsonData.username}
            onChange={onUsernameChange}
          />
        </InlineField>
        <InlineField label="Password" labelWidth={16}>
          <SecretInput
            isConfigured={(secureJsonFields && secureJsonFields.password) as boolean}
            value={secureJsonData.password || ''}
            placeholder="password"
            onReset={onResetPassword}
            onChange={onPasswordChange}
          />
        </InlineField>
        <Button
          icon={isPinging ? 'fa fa-spinner' : 'sync'}
          onClick={onPing}
          variant='primary'
          tooltip={'Click to ping your FTP server'}
          tooltipPlacement='right'
        >
          {isPinging ? 'Pinging...' : 'Ping'}
        </Button>
      </SectionHeader>

      <SectionHeader title='Database'>
        <InlineField label="Mode" labelWidth={16} grow>
          <RadioButtonGroup
            fullWidth
            options={ftpTargetOptions}
            value={jsonData.target ?? 'file'}
            onChange={onTargetTypeChange}
          />
        </InlineField>
        {
          renderTargetPathFields()
        }
        <InlineField label="File(s) age (hours)" labelWidth={16}>
          <Input
            placeholder="24"
            value={jsonData.age}
            onChange={onAgeChange}
          />
        </InlineField>
        <Button
          icon={isPulling ? 'fa fa-spinner' : 'sync'}
          onClick={onCheck}
          variant='primary'
          tooltip={'Click to verify the provided files on FTP server'}
          tooltipPlacement='right'
        >
          {isPulling ? 'Checking...' : 'Check'}
        </Button>
      </SectionHeader>
    </div>
  );
}
