import { Null, Undefined } from '@shared/typings/generic.typing'

export interface ServerDataCommon {
  status: string
  code: string
  msg: string
}

export interface ServerDataSuccess<T> extends ServerDataCommon {
  success: true
  body: T
  headers: Undefined<{
    [key: string]: string
  }>
}

export interface ServerDataError extends ServerDataCommon {
  success: false
  body: Null<unknown>
}

export type ServerData<T> = ServerDataSuccess<T> | ServerDataError
