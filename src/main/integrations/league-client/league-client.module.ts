import { LeagueClientDataDownloadService } from '@main/integrations/league-client/league-client-data-download.service';
import { LeagueClientDataReaderService } from '@main/integrations/league-client/league-client-data-reader.service';
import { Global, Module } from '@nestjs/common';
import { LeagueClientService } from './league-client.service';
import { AppConfigModule } from '@main/modules/app-config/app-config.module';

@Global()
@Module({
  providers: [
    LeagueClientService,
    LeagueClientDataDownloadService,
    LeagueClientDataReaderService,
  ],
  exports: [
    LeagueClientService,
    LeagueClientDataReaderService,
    LeagueClientDataDownloadService,
  ],
  imports: [AppConfigModule],
})
export class LeagueClientModule {}
