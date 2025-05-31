import { AbstractException } from '@main/exceptions/abstract-exception';
import { constraintsErrors } from '@main/utils/messages.util';
import type { Undefined } from '@shared/typings/generic.typing';
import { ValidationError } from 'class-validator';

export class ValidationErrorException extends AbstractException {
  public erros: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('validationError');
    this.erros = errors;
  }

  parse() {
    const parseError: Record<string, string[]> = {};

    this.erros.forEach((err) => {
      parseError[err.property] = this.buildArrayErrors(err.constraints);
    });

    return parseError;
  }

  private buildArrayErrors(constraints: Undefined<Record<string, string>>) {
    if (!constraints) return [];

    const errors: string[] = [];

    Object.entries(constraints).forEach(([key, value]) => {
      if (value.startsWith('*')) {
        errors.push(value.substring(1));
      } else {
        errors.push(this.parseMessageError(key, value));
      }
    });

    return errors;
  }

  private parseMessageError(constraints: string, value: string) {
    const parseMessage = constraintsErrors[constraints];

    if (!parseMessage) {
      return value;
    }

    let message = parseMessage.message;
    const regexFilterParam = parseMessage.regexFilterParam;

    if (!regexFilterParam) return message;

    const regex = new RegExp(regexFilterParam, 'g');

    const params = regex.exec(value);
    if (params) {
      params.shift();
      params.forEach((param, index) => {
        message = message.replace(`{${index}}`, param);
      });
    }

    return message;
  }
}
