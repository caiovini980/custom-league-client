import { electronApp } from '@electron-toolkit/utils';
import { WinstonLoggerService } from '@main/integrations/logger/winston-logger.service';
import { ElectronIpcTransport } from '@main/ipc';
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { app, protocol } from 'electron';
import {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
  installExtension,
} from 'electron-devtools-installer';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app.module';

process.on('message', (data) => {
  console.log('graceful-exit', data);
});

async function bootstrap() {
  initializeTransactionalContext();
  app.on('before-quit', async () => {
    await nestApp.close();
  });

  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'media',
      privileges: {
        secure: true,
        supportFetchAPI: true,
        bypassCSP: true,
      },
    },
    {
      scheme: 'local-media',
      privileges: {
        secure: true,
        supportFetchAPI: true,
        bypassCSP: true,
      },
    },
  ]);

  await app.whenReady();

  const log = new WinstonLoggerService();

  try {
    const exts = await installExtension([
      REDUX_DEVTOOLS,
      REACT_DEVELOPER_TOOLS,
    ]);
    exts.forEach((e) => {
      log.info(`Added extension: ${e.name}`);
    });
  } catch (err) {
    console.log('An error occurred: ', err);
  }

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
bootstrap().catch((e) => {
  console.error(e);
  app.quit();
});
