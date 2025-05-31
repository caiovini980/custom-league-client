import { BrowserWindowRegisterService } from '@main/integrations/browser-window-register/browser-window-register.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [BrowserWindowRegisterService],
  exports: [BrowserWindowRegisterService],
})
export class BrowserWindowRegisterModule {}
