export type Undefined<T> = T | undefined
export type Null<T> = T | null
export type NullOrUndefined<T> = T | null | undefined
export type ClassType<C> = new (...args: any[]) => C
export type AbstractClassType<C> = abstract new (...args: any[]) => C
export type MultiClassType<C> = ClassType<C> | AbstractClassType<C>

export interface ApiServerDataCommon {
  status: string
  code: string
  msg: string
}

export interface ApiServerDataSuccess<T> extends ApiServerDataCommon {
  success: true
  body: T
  headers: Undefined<{
    [key: string]: string
  }>
}

export interface ApiServerDataError extends ApiServerDataCommon {
  success: false
  body: Null<unknown>
}

export type ApiServerData<T> = ApiServerDataSuccess<T> | ApiServerDataError
