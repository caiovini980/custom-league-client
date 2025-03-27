import { Global, Module } from '@nestjs/common';
import { CommonLogger } from './common-logger.abstract';
import { WinstonLoggerService } from './winston-logger.service';

@Global()
@Module({
  providers: [
    {
      provide: CommonLogger,
      useClass: WinstonLoggerService,
    },
  ],
  exports: [CommonLogger],
})
export class LoggerModule {}
