import { messagesUtil, MessagesUtilKeys } from '@main/utils/messages.util'

export class IpcException extends Error {
  code: string
  private readonly description: string

  constructor(code: MessagesUtilKeys, description?: string) {
    super(messagesUtil[code])
    this.code = code
    this.description = description ?? ''
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
  }

  toJson() {
    return {
      name: IpcException.name,
      message: this.message,
      code: this.code,
      description: this.description
    }
  }
}
