import { SelectableValue } from '@grafana/data';
import { AccessType, TargetType } from 'types';

export const ftpTargetOptions: Array<SelectableValue<TargetType>> = [
  {
    label: 'File',
    value: 'file',
    icon: 'file-alt',
  },
  {
    label: 'Files',
    value: 'files',
    icon: 'file-copy-alt',
  },
  {
    label: 'Folder',
    value: 'folder',
    icon: 'folder',
    ariaLabel: 'Will auto-detect all the csv and xlsx',
  },
];

export const accessTypeOptions: Array<SelectableValue<AccessType>> = [
  {
    title: 'SFTP',
    label: 'SFTP',
    value: 'sftp',
    description: '',
  },
  {
    title: 'FTP',
    label: 'FTP',
    value: 'ftp',
    description: '',
  },
];
