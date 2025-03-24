import { Global, Module } from '@nestjs/common'
import { WinstonLoggerService } from './winston-logger.service'
import { CommonLogger } from './common-logger.abstract'

@Global()
@Module({
  providers: [
    {
      provide: CommonLogger,
      useClass: WinstonLoggerService
    }
  ],
  exports: [CommonLogger]
})
export class LoggerModule {}
