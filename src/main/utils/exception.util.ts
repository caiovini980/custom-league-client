import { ClassType } from 'class-transformer-validator'
import { ValidationErrorException } from '@main/exceptions/validation-error.exception'
import { transformAndValidateSync as tvs } from 'class-transformer-validator'

export const transformAndValidateSync = <T extends object>(
  classType: ClassType<T>,
  object: object
) => {
  try {
    return tvs<T>(classType, object)
  } catch (e: any) {
    throw new ValidationErrorException(e)
  }
}
