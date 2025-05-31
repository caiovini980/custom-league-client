import { Module } from '@nestjs/common';
import { UpdaterService } from './updater.service';
import { UpdaterController } from './updater.controller';

@Module({
  imports: [],
  providers: [UpdaterService],
  controllers: [UpdaterController],
})
export class UpdaterModule {}
