import { Global, Module } from '@nestjs/common';
import { LeagueClientService } from './league-client.service';

@Global()
@Module({
  providers: [LeagueClientService],
  exports: [LeagueClientService],
})
export class LeagueClientModule {}
