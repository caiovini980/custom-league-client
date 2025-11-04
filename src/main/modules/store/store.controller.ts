import { IpcHandle } from '@main/ipc';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { type StoreView } from '@shared/typings/ipc-function/handle/store.typing';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @IpcHandle('getStoreData')
  async getStoreData(@Payload() payload: StoreView) {
    return await this.storeService.getStoreData(payload);
  }
}
