import { Global, Module } from '@nestjs/common'
import { BrowserWindowRegisterService } from '@main/integrations/browser-window-register/browser-window-register.service'

@Global()
@Module({
  providers: [BrowserWindowRegisterService],
  exports: [BrowserWindowRegisterService]
})
export class BrowserWindowRegisterModule {}
