import { AppService } from '@main/app.service';
import { configModuleConfig } from '@main/config/config-module.config';
import { electronModuleConfig } from '@main/config/electron-module.config';
import { providerConfig } from '@main/config/provider.config';
import { serverStaticModuleConfig } from '@main/config/server-static-module.config';
import { BrowserWindowRegisterModule } from '@main/integrations/browser-window-register/browser-window-register.module';
import { ContextModule } from '@main/integrations/context/context.module';
import { LeagueClientModule } from '@main/integrations/league-client/league-client.module';
import { LoggerModule } from '@main/integrations/logger/logger.module';
import { typeormModule } from '@main/integrations/typeorm/typeorm.module';
import { Module } from '@nestjs/common';

// Modules

import { UpdaterModule } from '@main/modules/updater/updater.module';
import { AppConfigModule } from '@main/modules/app-config/app-config.module';
import { ClientModule } from '@main/modules/client/client.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  providers: [...providerConfig, AppService],
  imports: [
    typeormModule,
    configModuleConfig,
    serverStaticModuleConfig,
    electronModuleConfig,
    EventEmitterModule.forRoot(),
    BrowserWindowRegisterModule,
    ContextModule,
    LoggerModule,
    LeagueClientModule,
    ClientModule,
    AppConfigModule,
    UpdaterModule,
  ],
})
export class AppModule {}
