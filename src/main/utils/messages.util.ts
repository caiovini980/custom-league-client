import { ConstraintsErrosData } from '@main/typings/message.typings';

export const messagesUtil = {
  routeNotFound: 'Route not found',
  badRequest: 'Error in request.',
  unknownError: 'An error unknown occurred',
  requestDone: 'Request complete.',
  methodNotFound: 'Method not found.',
  validationError: 'Validation`s error',
  contextDataNotExist: 'Context Data not exist',
  entityNotFound: 'Error on find entity',
};

export const constraintsErrors: ConstraintsErrosData = {
  isEmail: {
    message: 'Must be an Email',
  },
  isLength: {
    message: 'deve ser maior ou igual {0} caracteres',
    regexFilterParam: '.* must be longer than or equal to (.*) characters',
  },
  isNotEmpty: {
    message: 'Must not be empty',
  },
  isString: {
    message: 'Must be a string',
  },
};

export type ConstraintsKeys = keyof typeof constraintsErrors;
export type MessagesUtilKeys = keyof typeof messagesUtil;
