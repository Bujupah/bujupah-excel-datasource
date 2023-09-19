/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, useEffect } from 'react';
import {
  InlineField,
  RadioButtonGroup,
  SecretInput,
  Input,
  InlineSwitch,
  HorizontalGroup,
  Button,
  Badge,
  Spinner,
} from '@grafana/ui';

import { DataSourcePluginOptionsEditorProps } from '@grafana/data';

import { AccessType, MyDataSourceOptions, MySecureJsonData, TargetType } from '../types';

import { ping, check } from '../services/backend';

import SectionHeader from './widgets/SectionHeader';

import { ftpTargetOptions, accessTypeOptions } from './constants';
import { checkLimit, convertBytes } from 'utils/file';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> { }

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const [init, setInit] = React.useState<boolean>(false);

  const [pingResult, setPingResult] = React.useState<boolean | undefined>(undefined);
  const [isPinging, setIsPinging] = React.useState(false);
  const [isPulling, setIsChecking] = React.useState(false);

  const [ftpFiles, setFtpFiles] = React.useState<Array<{ name: string; size: number }>>([]);

  const { jsonData, secureJsonFields } = options;
  const secureJsonData = (options.secureJsonData || {}) as MySecureJsonData;

  useEffect(() => {
    const pathIsEmpty = !jsonData.path || jsonData.path.length === 0;
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      path: pathIsEmpty ? [''] : jsonData.path,
      target: jsonData.target ?? 'file',
      access: jsonData.access ?? 'sftp',
    };
    onPing();
    onOptionsChange({ ...options, jsonData: data });
    setInit(true);
  }, []);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      [event.target.name]: ['ignoreHostKey', 'trimLeadingSpace'].includes(event.target.name)
        ? event.target.checked
        : event.target.value,
    };
    onOptionsChange({ ...options, jsonData: data });
  };

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
      path: jsonData.path,
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
  };

  const onFilePathIdxChange = (event: ChangeEvent<HTMLInputElement>, idx: number) => {
    const hasSamePath = jsonData.path.find((path: string) => event.target.value === path);
    if (hasSamePath) {
      jsonData.path = [...new Set(jsonData.path)];
    }

    jsonData.path[idx] = event.target.value;
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      path: jsonData.path,
    };
    onOptionsChange({ ...options, jsonData: data });
  };

  const onPing = async () => {
    setIsPinging(true);
    ping(options.uid, { jsonData, secureJsonFields, secureJsonData }).then((result) => {
      setPingResult(result);
      setIsPinging(false);
    });
  };

  const onCheck = async () => {
    setIsChecking(true);
    check(options.uid, { jsonData, secureJsonFields, secureJsonData }, setFtpFiles).then((result) => {
      setPingResult(result);
      setIsChecking(false);
    });
  };

  const onAddPath = () => {
    const hasAlready = jsonData.path[jsonData.path.length - 1] === '';
    if (hasAlready) {
      return;
    }
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      path: [...jsonData.path, ''],
    };
    onOptionsChange({ ...options, jsonData: data });
  };

  const onRemovePath = (idx: number) => {
    const paths = jsonData.path.filter((_, i) => i !== idx);
    const data: MyDataSourceOptions = {
      ...options.jsonData,
      path: paths,
    };
    onOptionsChange({ ...options, jsonData: data });
  };

  const renderTargetPathFields = () => {
    if (jsonData.target === 'file') {
      return (
        <InlineField label="File" labelWidth={16} grow tooltip={'Files should not exceed 5MB'}>
          <Input
            placeholder="Path to your csv/xlsx file"
            value={jsonData.path && jsonData.path.length > 0 ? jsonData.path[0] : ''}
            onChange={onFilePathChange}
          />
        </InlineField>
      );
    }

    if (jsonData.target === 'folder') {
      return (
        <InlineField label="Folder" labelWidth={16} grow tooltip={'Files should not exceed 5MB'}>
          <Input
            placeholder="Path to your folder"
            value={jsonData.path && jsonData.path.length > 0 ? jsonData.path[0] : ''}
            onChange={onFilePathChange}
          />
        </InlineField>
      );
    }

    if (jsonData.target === 'files') {
      return (
        <>
          <InlineField label={`Files`} labelWidth={16} grow tooltip={'Files should not exceed 5MB'}>
            <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
              {jsonData.path.map((item: string, idx) => {
                return (
                  <HorizontalGroup key={`file_key_${idx}`}>
                    <Input
                      placeholder="Path to your csv/xlsx file"
                      value={item}
                      width={53}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => onFilePathIdxChange(e, idx)}
                    />
                    <Button icon="minus" variant="destructive" onClick={() => onRemovePath(idx)}></Button>
                  </HorizontalGroup>
                );
              })}
              <Button icon="plus" variant="secondary" onClick={onAddPath}>
                Add new file path
              </Button>
            </div>
          </InlineField>
        </>
      );
    }

    return <>Target type is not supported</>;
  };

  if (!init) {
    return <Spinner />;
  }

  return (
    <div className="gf-form-group">

      <SectionHeader
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Access{' '}
            <Badge
              color={pingResult === undefined ? 'blue' : pingResult === true ? 'green' : 'red'}
              icon="signal"
              text={pingResult === undefined ? 'n/a' : pingResult === true ? 'connected' : 'not connected'}
            />
          </div>
        }
      >
        <InlineField label="Type" labelWidth={16} grow>
          <RadioButtonGroup
            fullWidth
            options={accessTypeOptions}
            value={jsonData.access ?? 'sftp'}
            onChange={onAccessTypeChange}
          />
        </InlineField>
        <HorizontalGroup>
          <InlineField label="Host" labelWidth={16}>
            <Input placeholder="your.ftp.host" value={jsonData.host} onChange={onInputChange} name="host" />
          </InlineField>
          <InlineField label="Port">
            <Input placeholder="22" value={jsonData.port} onChange={onInputChange} name="port" />
          </InlineField>
        </HorizontalGroup>
        <InlineField label="Ignore host key" labelWidth={16}>
          <InlineSwitch value={jsonData.ignoreHostKey} onChange={onInputChange} name="ignoreHostKey" />
        </InlineField>
        <InlineField label="Username" labelWidth={16}>
          <Input placeholder="username" value={jsonData.username} onChange={onInputChange} name="username" />
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
          variant="primary"
          tooltip={'Click to ping your FTP server'}
          tooltipPlacement="right"
        >
          {isPinging ? 'Pinging...' : 'Ping'}
        </Button>
      </SectionHeader>

      <SectionHeader title="Database">
        <InlineField label="Mode" labelWidth={16} grow>
          <RadioButtonGroup
            fullWidth
            options={ftpTargetOptions}
            value={jsonData.target ?? 'file'}
            onChange={onTargetTypeChange}
          />
        </InlineField>
        {renderTargetPathFields()}
        <Button
          icon={isPulling ? 'fa fa-spinner' : 'sync'}
          onClick={onCheck}
          variant="primary"
          tooltip={'Click to verify the provided files on FTP server'}
          tooltipPlacement="right"
          disabled={!pingResult}
        >
          {isPulling ? 'Checking...' : 'Check'}
        </Button>

        {ftpFiles.length > 0 && <div style={{ paddingTop: '16px' }}>
          {
            <table className='filter-table'>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Size</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {ftpFiles.map((file, idx) => {
                  return (
                    <tr key={`file_${idx}`}>
                      <td>{file.name}</td>
                      <td>{convertBytes(file.size)}</td>
                      <td>
                        <Badge
                          tooltip={
                            checkLimit(file.size, 5)
                              ? undefined
                              : 'File size is more than 5MB'
                          }
                          color={checkLimit(file.size, 5) ? 'green' : 'red'}
                          text={checkLimit(file.size, 5) ? 'accepted' : 'declined'}
                          icon="info-circle"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          }
        </div>}
      </SectionHeader>


      <SectionHeader title="Options">
        <InlineField label="Delimiter" labelWidth={16} tooltip="Delimiter to be used to parse the CSV files.">
          <Input placeholder="," value={jsonData.delimiter} onChange={onInputChange} name="delimiter" />
        </InlineField>
        <InlineField label="Comment" labelWidth={16}>
          <Input placeholder="#" value={jsonData.comment} onChange={onInputChange} name="comment" />
        </InlineField>
        <InlineField label="Age" labelWidth={16} tooltip={'File(s) age in hours, if it is reached, grafana server will try to pull a new copy from FTP server.'}>
          <Input placeholder="24" value={jsonData.age} onChange={onInputChange} name="age" />
        </InlineField>
        <InlineField label="Trim leading space" labelWidth={16}>
          <InlineSwitch value={jsonData.trimLeadingSpace} onChange={onInputChange} name="trimLeadingSpace" />
        </InlineField>
      </SectionHeader>
    </div>
  );
}
