import { getBackendSrv } from '@grafana/runtime';

const backend = getBackendSrv();

export const ping = async (uid: string, payload: any): Promise<boolean | undefined> => {
  const res = await backend
    .post(`/api/datasources/uid/${uid}/resources/ping`, {
      access: payload.jsonData.access,
      host: payload.jsonData.host,
      port: +payload.jsonData.port,
      username: payload.jsonData.username,
      password: payload.secureJsonData.password ?? '',
      secure: payload.secureJsonFields.password,
      ignoreHostKey: payload.jsonData.ignoreHostKey,
    })
    .then((res) => {
      return res.status === 200;
    })
    .catch((err) => {
      console.error(err);
      return undefined;
    });
  return res;
};

export const check = async (uid: string, payload: any): Promise<boolean | undefined> => {
  if (!payload.jsonData.target || payload.jsonData.target.length === 0) {
    return undefined;
  }
  const res = await backend
    .post(`/api/datasources/uid/${uid}/resources/check`, {
      access: payload.jsonData.access,
      host: payload.jsonData.host,
      port: +payload.jsonData.port,
      username: payload.jsonData.username,
      password: payload.secureJsonData.password ?? '',
      secure: payload.secureJsonFields.password,
      ignoreHostKey: payload.jsonData.ignoreHostKey,
      target: payload.jsonData.path[0],
    })
    .then((res) => {
      return res.status === 200;
    })
    .catch((err) => {
      console.error(err);
      return undefined;
    });
  return res;
};
