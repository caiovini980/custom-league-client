import { electronApp } from '@electron-toolkit/utils';
import { WinstonLoggerService } from '@main/integrations/logger/winston-logger.service';
import { ElectronIpcTransport } from '@main/ipc';
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { app } from 'electron';
import { AppModule } from './app.module';

process.on('message', (data) => {
  console.log('graceful-exit', data);
});

async function bootstrap() {
  app.on('before-quit', async () => {
    await nestApp.close();
  });

  await app.whenReady();
  const log = new WinstonLoggerService();

  const nestApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      logger: log,
      strategy: new ElectronIpcTransport(),
    },
  );

  await nestApp.enableShutdownHooks().listen();

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');
}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
try {
  bootstrap();
} catch (e) {
  console.error(e);
  app.quit();
}
