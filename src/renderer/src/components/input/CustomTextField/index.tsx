import { InputAdornment, TextField, debounce } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';
import { getNumber, mask } from '@render/utils/stringUtil';
import { Null, Undefined } from '@shared/typings/generic.typing';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type Pattern = string[] | string | ((value: string) => string | undefined);

export interface CustomTextFieldProps
  extends Omit<TextFieldProps, 'value' | 'onChange'> {
  pattern?: Pattern;
  justNumber?: boolean;
  onChangeText?: (text: string) => void;
  showLimitCounter?: boolean;
  value?: Null<string>;
  readOnly?: boolean;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  fieldLimit?: number;
  debounceTime?: number;
}

export const CustomTextField = ({
  pattern,
  justNumber,
  value,
  onChangeText,
  readOnly = false,
  showLimitCounter = true,
  endIcon,
  startIcon,
  fieldLimit,
  debounceTime = 50,
  ...props
}: CustomTextFieldProps) => {
  const [textValue, setTextValue] = useState('');
  const [tempKey, setTempKey] = useState(true);
  const lastPattern = useRef('');
  const lastValues = useRef(['', '']);

  const debounceText = useCallback(
    !debounceTime
      ? (d: string) => onChangeText?.(d)
      : debounce((d: string) => onChangeText?.(d), debounceTime),
    [onChangeText, debounceTime],
  );

  useEffect(() => {
    if (value) {
      if (!lastValues.current.includes(value) || pattern) {
        applyMask(value);
      }
    } else {
      setTextValue((props.defaultValue as Undefined<string>) || '');
    }
  }, [value]);

  useEffect(() => {
    // truque para força a renderização quando usando autofill do navegador
    const id = setTimeout(() => setTempKey(false), 300);
    return () => {
      clearTimeout(id);
    };
  }, []);

  const limitarTexto = (text: string) => {
    if (fieldLimit && text.length > fieldLimit) {
      return text.slice(0, fieldLimit);
    }
    return text;
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    applyMask(value);
  };

  const applyMask = (value: string) => {
    let val: string;
    if (pattern) {
      let patt = '';
      if (typeof pattern === 'string') {
        patt = pattern;
      } else if (Array.isArray(pattern)) {
        for (const pt of pattern) {
          const lenPattern = (pt.match(/#/g) || []).length;
          if (lenPattern >= getNumber(value).length) {
            patt = pt;
            break;
          }
        }
      } else {
        const pt = pattern(value);
        if (pt === undefined) {
          val = justNumber ? getNumber(value) : value;
          setTextValue(limitarTexto(val));
          if (onChangeText) debounceText(limitarTexto(val));
          return;
        }
        patt = pt;
      }
      if (patt) {
        lastPattern.current = patt;
      } else {
        patt = lastPattern.current;
      }
      const newValue = value.substring(0, patt.length);
      const unMask = getNumber(newValue);

      const maskValue = mask(unMask, patt, justNumber);

      setTextValue(limitarTexto(maskValue));
      val = unMask;
      lastValues.current = [val, newValue];
    } else {
      val = justNumber ? getNumber(value) : value;
      setTextValue(limitarTexto(val));
    }

    if (onChangeText) debounceText(limitarTexto(val));
  };

  const getLimitCaracterText = () => {
    if (!fieldLimit) return undefined;
    return `${fieldLimit - textValue.length} caracter(es) restantes`;
  };

  const getEndIcon = () => {
    if (!endIcon) return undefined;
    return <InputAdornment position={'end'}>{endIcon}</InputAdornment>;
  };

  const getStartIcon = () => {
    if (!startIcon) return undefined;
    return <InputAdornment position={'start'}>{startIcon}</InputAdornment>;
  };

  const getHelperText = () => {
    if (props) {
      if (props.helperText) {
        return props.helperText;
      }
      if (showLimitCounter) {
        return getLimitCaracterText();
      }
    }
    return undefined;
  };

  return (
    <TextField
      key={tempKey ? textValue : undefined}
      size={'small'}
      variant={'outlined'}
      fullWidth
      {...props}
      helperText={getHelperText()}
      slotProps={{
        htmlInput: {
          autoComplete: 'off',
          maxLength: fieldLimit,
          ...props.slotProps?.htmlInput,
        },
        input: {
          readOnly,
          endAdornment: getEndIcon(),
          startAdornment: getStartIcon(),
          sx: {
            borderRadius: '12px',
          },
          ...props.slotProps?.input,
        },
        inputLabel: {
          // @ts-ignore
          shrink: true,
          ...props.slotProps?.inputLabel,
        },
      }}
      onChange={onChange}
      value={textValue}
    />
  );
};

export default CustomTextField;
