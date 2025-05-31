import { systemConfig } from '@main/config/system.config';
import { ConfigModule } from '@nestjs/config';

export const configModuleConfig = ConfigModule.forRoot({
  load: [systemConfig],
  isGlobal: true,
});
