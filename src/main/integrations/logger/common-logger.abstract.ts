import { LoggerService } from '@nestjs/common';

export abstract class CommonLogger implements LoggerService {
  abstract debug(message: unknown, ...optionalParams: unknown[]): unknown;

  abstract error(message: unknown, ...optionalParams: unknown[]): unknown;

  abstract log(message: unknown, ...optionalParams: unknown[]): unknown;

  abstract verbose(message: unknown, ...optionalParams: unknown[]): unknown;

  abstract warn(message: unknown, ...optionalParams: unknown[]): unknown;

  abstract info(message: unknown, ...optionalParam: unknown[]): unknown;

  abstract setContext(context: string): void;

  protected buildWithOptionalParam(message: unknown, optionalParam: unknown[]) {
    return optionalParam.reduce<string>(
      (prev, curr) => `${prev} ${curr}`,
      String(message),
    );
  }
}
