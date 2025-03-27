import { ContextKeys } from '@main/typings/context.typings';
import { Injectable, Scope } from '@nestjs/common';
import type { NullOrUndefined } from '@shared/typings/generic.typing';
import { format } from 'date-fns';
import * as winston from 'winston';
import { ContextUtil } from '../context/context.util';
import { CommonLogger } from './common-logger.abstract';

const { combine, timestamp, printf, colorize } = winston.format;

const colors = {
  trace: 'magenta',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  debug: 'blue',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  error: 'red',
  yellow: 'yellow',
  blue: 'blue',
  green: 'green',
  red: 'red',
  grey: 'grey',
  gray: 'gray',
  cyan: 'cyan',
  black: 'black',
  white: 'white',
  magenta: 'magenta',
};

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService extends CommonLogger {
  private readonly logger: winston.Logger;
  private context: NullOrUndefined<string> = null;
  private ctx = ContextUtil.getInstance();

  constructor() {
    super();
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.LOGGER_LEVEL || 'debug',
          format: combine(timestamp(), this.consoleFormat()),
        }),
      ],
      exitOnError: false,
    });
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.logger.warn(this.buildWithOptionalParam(message, optionalParams));
  }

  private getValueContext<K extends keyof ContextKeys>(
    context: K,
    key: keyof ContextKeys[K],
  ) {
    const values = this.ctx.getContext(context);
    return values ? (values[key] as string) : null;
  }

  private consoleFormat() {
    return printf(({ level, message, timestamp }) => {
      const buildMessage: string[] = [];

      const addMessage = (
        color: keyof typeof colors,
        value: string | null,
        bracket = true,
      ) => {
        if (!value) return;
        const msg = this.c(color, value);
        bracket ? buildMessage.push(`[ ${msg} ]`) : buildMessage.push(msg);
      };

      const tempLevel = level as keyof typeof colors;
      const transactionId = this.getValueContext('logger', 'transactionId');
      const channel = this.getValueContext('logger', 'channel');
      const context = this.context || 'Main';
      const formatTime = format(
        new Date(timestamp as number),
        'dd/MM/yyyy HH:mm:ss',
      );
      addMessage('grey', formatTime, false);
      addMessage(tempLevel, tempLevel);
      addMessage('magenta', transactionId);
      addMessage('yellow', context);
      addMessage('gray', channel);
      addMessage('white', '::', false);
      addMessage(tempLevel, message as string, false);
      return buildMessage.join(' ');
    });
  }

  private c(color: keyof typeof colors, message: string): string {
    const colorizer = colorize({ colors }).colorize;
    const isColor = process.env.MAIN_VITE_LOGGER_COLOR === 'true';
    return isColor ? colorizer(color, message) : message;
  }

  debug(message: unknown, ...optionalParam: unknown[]) {
    this.logger.debug(this.buildWithOptionalParam(message, optionalParam));
  }

  verbose(message: unknown, ...optionalParam: unknown[]) {
    this.logger.verbose(this.buildWithOptionalParam(message, optionalParam));
  }

  info(message: unknown, ...optionalParam: unknown[]) {
    this.logger.info(this.buildWithOptionalParam(message, optionalParam));
  }

  error(message: unknown, ...optionalParam: unknown[]) {
    if (this.context === 'InstanceLoader') {
      this.logger.error(message);
      this.logger.error(optionalParam[0]);
      return;
    }
    this.logger.error(this.buildWithOptionalParam(message, optionalParam));
  }

  log(msg: unknown, context: string) {
    this.setContext(context);
    this.info(msg);
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    this.error(message, optionalParams);
  }

  setContext(context: string) {
    this.context = context;
  }
}
