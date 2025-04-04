import { LeagueClientDataDownloadService } from '@main/integrations/league-client/league-client-data-download.service';
import { LeagueClientDataReaderService } from '@main/integrations/league-client/league-client-data-reader.service';
import { Global, Module } from '@nestjs/common';
import { LeagueClientService } from './league-client.service';

@Global()
@Module({
  providers: [
    LeagueClientService,
    LeagueClientDataDownloadService,
    LeagueClientDataReaderService,
  ],
  exports: [LeagueClientService],
})
export class LeagueClientModule {}
