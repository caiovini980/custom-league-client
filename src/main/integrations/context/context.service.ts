import { SystemConfig } from '@main/config/system.config';
import { IpcException } from '@main/exceptions/ipc.exception';
import { ContextUtil } from '@main/integrations/context/context.util';
import { AppContextType, ContextKeys } from '@main/typings/context.typings';
import { Undefined } from '@main/typings/generic.typing';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContextService {
  private contextUtil = ContextUtil.getInstance();

  constructor(private configService: ConfigService<SystemConfig, true>) {}

  getConfig<T extends keyof SystemConfig>(key: T): SystemConfig[T] {
    return this.configService.get(key, { infer: true });
  }

  getDataContext<K extends keyof ContextKeys>(
    key: K,
  ): Undefined<ContextKeys[K]> {
    return this.contextUtil.getContext(key);
  }

  getDataContextThrow<K extends keyof ContextKeys>(key: K): ContextKeys[K] {
    const data = this.contextUtil.getContext(key);

    if (!data) {
      throw new IpcException('contextDataNotExist');
    }

    return data;
  }

  setDataContext<K extends keyof ContextKeys>(key: K, data: ContextKeys[K]) {
    this.contextUtil.setContext(key, data);
  }

  changeContext<T>(context: AppContextType, cb: () => Promise<T>) {
    return this.contextUtil.changeContext(context, cb);
  }
}
