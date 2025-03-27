import { FieldError } from 'react-hook-form';
import { z } from 'zod';

const zodMessage = {
  too_small: 'Deve ter o mínimo de % caracter(es).',
  minNumber: 'Deve ser maior que %.',
  required: 'O campo é necessário.',
  oneOf: 'Deve ser: %.',
  notOneOf: 'Não deve ser: %.',
  invalid_type: 'Campo inválido.',
} as const;

const zodMessageParse = (error: FieldError) => {
  return error.message;
};

const convertMessage = (message: keyof typeof zodMessage, values: string[]) => {
  let msg: string = zodMessage[message];
  values.forEach((v) => {
    msg = msg.replace('%', v);
  });
  return msg;
};

z.setErrorMap((error, _ctx) => {
  switch (error.code) {
    case 'invalid_type': {
      return {
        message: 'Campo inválido',
      };
    }

    case 'invalid_string': {
      if (error.validation === 'email') {
        return {
          message: 'Email inválido',
        };
      }
      return {
        message: _ctx.defaultError,
      };
    }

    case 'too_small': {
      return {
        message: convertMessage('too_small', [error.minimum.toString()]),
      };
    }

    default: {
      return {
        message: _ctx.defaultError,
      };
    }
  }
});

export { zodMessageParse, convertMessage, z };
