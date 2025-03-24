import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

export interface IpcContext {
  channel: string
  ipcEvt: IpcMainEvent | IpcMainInvokeEvent
}

export interface IpcOptions {
  showLog?: boolean
}
