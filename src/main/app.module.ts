import { AppService } from '@main/app.service';
import { configModuleConfig } from '@main/config/config-module.config';
import { electronModuleConfig } from '@main/config/electron-module.config';
import { providerConfig } from '@main/config/provider.config';
import { serverStaticModuleConfig } from '@main/config/server-static-module.config';
import { typeormModuleConfig } from '@main/config/typeorm-module.config';
import { BrowserWindowRegisterModule } from '@main/integrations/browser-window-register/browser-window-register.module';
import { ContextModule } from '@main/integrations/context/context.module';
import { LoggerModule } from '@main/integrations/logger/logger.module';
import { ServerModule } from '@main/modules/server/server.module';
import { Module } from '@nestjs/common';
import { LeagueClientModule } from './integrations/league-client/league-client.module';
import { LobbyModule } from './modules/lobby/lobby.module';


@Module({
  providers: [...providerConfig, AppService],
  imports: [
    typeormModuleConfig,
    configModuleConfig,
    serverStaticModuleConfig,
    electronModuleConfig,
    BrowserWindowRegisterModule,
    ContextModule,
    LoggerModule,
    ServerModule,
    LeagueClientModule,
    LobbyModule
  ],
})
export class AppModule {}
