import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigController } from './app-config.controller';
import { AppConfigEntity } from './app-config.entity';
import { AppConfigRepository } from './app-config.repository';
import { AppConfigService } from './app-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppConfigEntity])],
  providers: [AppConfigService, AppConfigRepository],
  controllers: [AppConfigController],
  exports: [AppConfigService],
})
export class AppConfigModule {}
