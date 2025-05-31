import { IpcException } from '@main/exceptions/ipc.exception';
import { ValidationErrorException } from '@main/exceptions/validation-error.exception';
import { CommonLogger } from '@main/logger/common-logger.abstract';
import {
  ArgumentsHost,
  Catch,
  NotFoundException,
  RpcExceptionFilter,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter {
  constructor(private logger: CommonLogger) {
    logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: Error, _host: ArgumentsHost): Observable<never> {
    this.logger.error(exception);
    this.logger.error(exception.stack);

    if (exception.name === 'IpcException') {
      return throwError(() => exception);
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const exceptionList: Record<string, (ex: any) => IpcException> = {
      NotFoundException: this.notFoundException,
      ValidationErrorException: this.classValidationException,
    };

    const execFuncException = exceptionList[exception.name] ?? null;

    if (execFuncException) {
      return throwError(() => execFuncException.bind(this)(exception));
    }
    return throwError(
      () => new IpcException('unknownError', exception.message),
    );
  }

  private notFoundException(ex: NotFoundException) {
    return new IpcException('routeNotFound', ex.message);
  }

  private classValidationException(ex: ValidationErrorException) {
    this.logger.error(ex.erros);
    return new IpcException('validationError');
  }
}
