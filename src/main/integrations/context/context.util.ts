import { v4 as uuidV4 } from 'uuid'
import { Undefined } from '@main/typings/generic.typing'
import { AppContextType, ContextKeys } from '@main/typings/context.typings'
import { merge } from 'lodash'
import { AsyncLocalStorage } from 'node:async_hooks'

export class ContextUtil {
  private static instance: ContextUtil
  private als: AsyncLocalStorage<Partial<ContextKeys>>

  private constructor() {
    this.als = new AsyncLocalStorage()
    ContextUtil.instance = this
  }

  static getInstance() {
    if (!ContextUtil.instance) ContextUtil.instance = new ContextUtil()
    return ContextUtil.instance
  }

  changeContext<T>(namespace: AppContextType, cb: () => Promise<T>) {
    return this.als.run({}, () => {
      this.setContext('logger', {
        context: namespace,
        transactionId: uuidV4()
      })
      return cb()
    })
  }

  setContext<K extends keyof ContextKeys>(key: K, data: Partial<ContextKeys[K]>) {
    const oldData = this.als.getStore() ?? {}
    const newData = merge(oldData, { [key]: data })
    this.als.enterWith(newData)
  }

  getContext<K extends keyof ContextKeys>(key: K): Undefined<ContextKeys[K]> {
    return this.als.getStore()?.[key]
  }
}
