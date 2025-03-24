import { ValidationErrorException } from '@main/exceptions/validation-error.exception';
import { Provider, Scope, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';

export const providerConfig: Provider[] = [
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new ValidationErrorException(errors),
    }),
  },
  {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
    scope: Scope.DEFAULT,
  },
];
