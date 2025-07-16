import { Module } from '@nestjs/common';
import { UpdaterController } from './updater.controller';
import { UpdaterService } from './updater.service';

@Module({
  imports: [],
  providers: [UpdaterService],
  controllers: [UpdaterController],
})
export class UpdaterModule {}
