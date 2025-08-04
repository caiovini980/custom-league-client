import { LeagueClientDataDownloadService } from '@main/integrations/league-client/league-client-data-download.service';
import { LeagueClientDataReaderService } from '@main/integrations/league-client/league-client-data-reader.service';
import { LeagueClientImageService } from '@main/integrations/league-client/league-client-image.service';
import { AppConfigModule } from '@main/modules/app-config/app-config.module';
import { Global, Module } from '@nestjs/common';
import { LeagueClientService } from './league-client.service';

@Global()
@Module({
  providers: [
    LeagueClientService,
    LeagueClientDataDownloadService,
    LeagueClientDataReaderService,
    LeagueClientImageService,
  ],
  exports: [
    LeagueClientService,
    LeagueClientDataReaderService,
    LeagueClientDataDownloadService,
  ],
  imports: [AppConfigModule],
})
export class LeagueClientModule {}
