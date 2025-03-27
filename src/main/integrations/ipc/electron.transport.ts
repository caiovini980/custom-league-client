import { IpcException } from '@main/exceptions/ipc.exception';
import { ContextUtil } from '@main/integrations/context/context.util';
import { Logger } from '@nestjs/common';
import type {
  CustomTransportStrategy,
  MessageHandler,
} from '@nestjs/microservices';
import { Server } from '@nestjs/microservices';
import { ipcMain } from 'electron';
import { isObservable, lastValueFrom } from 'rxjs';
import type { IpcContext, IpcOptions } from './interfaces';
import { ChannelMaps } from './transport';
import { linkPathAndChannel } from './utils';

interface ConstructorOps {
  name?: string;
  context?: (cb: () => unknown) => (...args: unknown[]) => Promise<unknown>;
}

export class ElectronIpcTransport
  extends Server
  implements CustomTransportStrategy
{
  protected readonly logger: Logger;
  private readonly ctxFn: ConstructorOps['context'];
  private ctx = ContextUtil.getInstance();

  constructor(opts?: ConstructorOps) {
    super();
    const name = opts?.name ?? ElectronIpcTransport.name;
    this.logger = new Logger(name);
    this.ctxFn = opts?.context;
  }

  listen(callback: () => void) {
    ChannelMaps.forEach(({ target, channel, opts }, channelId) => {
      const path = Reflect.getMetadata('path', target.constructor);
      const channelNames = linkPathAndChannel(channel, path);

      const handler = this.getHandlers().get(channelId);
      if (!handler) {
        const errMsg = `No handler for message channel "${channelNames[0]}"`;
        this.logger.error(errMsg);
        throw new Error(errMsg);
      }

      for (const ch of channelNames) {
        if (handler.isEventHandler) {
          ipcMain.on(ch, this.applyHandler(handler, ch, opts));
        } else {
          ipcMain.handle(ch, async (event, ...args) => {
            try {
              const result = await this.applyHandler(
                handler,
                ch,
                opts,
              )(event, ...args);
              return { result };
            } catch (e) {
              if (e instanceof IpcException) {
                return { error: e.toJson() };
              }
              throw e;
            }
          });
        }
      }
    });

    callback();
  }

  private applyHandler(
    handler: MessageHandler,
    channel: string,
    opts: IpcOptions = {},
  ): (...args: unknown[]) => Promise<unknown> {
    const handlerFn = async (...args) => {
      try {
        const { showLog } = opts;
        if (showLog) {
          if (!handler.isEventHandler)
            this.logger.log(`[IPC] Process message ${channel}`);
          else this.logger.log(`[IPC] Process event ${channel}`);
        }

        const [ipcMainEventObject, ...payload] = args;

        const data =
          payload.length === 0
            ? undefined
            : payload.length === 1
              ? payload[0]
              : payload;
        const ctx: IpcContext = { ipcEvt: ipcMainEventObject, channel };
        return this.ctx.changeContext('ipc', async () => {
          this.ctx.setContext('logger', {
            channel,
          });
          const res = await handler(data, ctx);
          return isObservable(res) ? await lastValueFrom(res) : res;
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error(error as string);
      }
    };

    if (this.ctxFn) {
      return this.ctxFn(handlerFn);
    }
    return handlerFn;
  }

  close() {
    return;
  }

  on<EventKey, EventCallback>(_event: EventKey, _callback: EventCallback) {
    return;
  }

  unwrap<T>(): T {
    return {} as T;
  }
}
