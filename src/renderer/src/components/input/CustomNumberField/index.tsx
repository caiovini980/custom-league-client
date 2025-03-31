import { InputAdornment, TextField, Typography, debounce } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';
import { Null } from '@shared/typings/generic.typing';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

export interface CustomNumberFieldProps
  extends Omit<TextFieldProps, 'value' | 'onChange'> {
  id: string;
  onChangeNumber?: (value: Null<number>) => void;
  value?: Null<number>;
  mode?: 'currency' | 'percent' | 'decimal';
  digit?: number;
  readOnly?: boolean;
  max?: number;
  maxLength?: number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  debounceTime?: number;
}

const CustomNumberField = ({
  id,
  onChangeNumber,
  value,
  mode = 'decimal',
  digit,
  readOnly = false,
  max,
  maxLength = 15,
  endIcon,
  startIcon,
  debounceTime = 50,
  ...textFieldProps
}: CustomNumberFieldProps) => {
  if (mode === 'currency' && digit === undefined) digit = 2;
  if (digit === undefined) digit = 0;

  const [numberValue, setNumberValue] = useState<Null<string>>(null);

  const debounceNumber = useCallback(
    !debounceTime
      ? (n: Null<number>) => onChangeNumber?.(n)
      : debounce((n: Null<number>) => onChangeNumber?.(n), debounceTime),
    [onChangeNumber, debounceTime],
  );

  const formatDecimalNumber = (value: string) => {
    return (Number(value) / Math.pow(10, digit)).toString();
  };

  const maxValue = (value: string) => {
    if (max !== undefined) {
      return Number(value) > max ? max.toString() : value;
    }
    return value;
  };

  const truncateValue = (value: string) => {
    if (maxLength === 0) return 0;
    if (maxLength) {
      const truncateValue = maxLength > 15 ? 15 : maxLength;
      return value.length >= truncateValue
        ? value.slice(0, truncateValue)
        : value;
    }
    return value;
  };

  const formater = (value: string) => {
    return Intl.NumberFormat('pt-BR', {
      minimumIntegerDigits: 1,
      minimumFractionDigits: digit,
    }).format(Number(value));
  };

  const currencyFormater = (value: string) => {
    const formater = Intl.NumberFormat('pt-Br', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: digit,
    });
    return formater.format(Number(value) || 0).replace('R$', '');
  };

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    event.persist();
    const caretStart = event.target.selectionStart || 0;

    const resultParsed = setNumber(value);

    const f = resultParsed.length - value.length;
    event.target.value = resultParsed;
    event.target.setSelectionRange(caretStart + f, caretStart + f);
  };

  const setNumber = (value: string) => {
    let result = value.replace(/\D+/g, '');

    if (!Number(result) && Number(result) === 0) {
      setNumberValue(result[0] || null);
      debounceNumber(result ? Number(result) : null);
      return '';
    }

    result = String(Number(result));

    if (maxLength) result = truncateValue(result) as string;
    if (digit > 0) result = formatDecimalNumber(result);
    if (max !== undefined) result = maxValue(result) as string;

    let resultParsed = formater(result);
    if (mode === 'currency') resultParsed = currencyFormater(result);

    debounceNumber(Number(result));
    setNumberValue(resultParsed);

    return resultParsed;
  };

  const getCurrentPrefix = () => {
    if (mode === 'currency') {
      return (
        <InputAdornment position="start">
          <Typography>R$</Typography>
        </InputAdornment>
      );
    }
    return startIcon;
  };

  const getPercentPrefix = () => {
    if (mode === 'percent') {
      return (
        <InputAdornment position="end">
          <Typography>%</Typography>
        </InputAdornment>
      );
    }
    return endIcon;
  };

  useEffect(() => {
    if (value || value === 0) setNumber(formater(value?.toString()));
  }, [value]);

  return (
    <TextField
      id={id}
      fullWidth
      size={'medium'}
      variant={'outlined'}
      value={numberValue ?? ''}
      onChange={onChangeInput}
      {...textFieldProps}
      slotProps={{
        ...textFieldProps.slotProps,
        input: {
          autoComplete: 'off',
          startAdornment: getCurrentPrefix(),
          endAdornment: getPercentPrefix(),
          readOnly,
          sx: {
            borderRadius: '12px',
          },
          ...textFieldProps.slotProps?.input,
        },
      }}
    />
  );
};

export default CustomNumberField;
