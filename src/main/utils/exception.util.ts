import { ValidationErrorException } from '@main/exceptions/validation-error.exception';
import {
  ClassType,
  transformAndValidateSync as tvs,
} from 'class-transformer-validator';
import { ValidationError } from 'class-validator';

export const transformAndValidateSync = <T extends object>(
  classType: ClassType<T>,
  object: object,
) => {
  try {
    return tvs<T>(classType, object);
  } catch (e) {
    throw new ValidationErrorException(e as ValidationError[]);
  }
};
