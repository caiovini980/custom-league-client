import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import { ReactNode } from 'react';

export interface CustomSelectProps<T extends SelectProps['value']>
  extends Omit<SelectProps<T>, 'onChange' | 'size'> {
  id: string;
  options: {
    label: string | ReactNode;
    value: T;
  }[];
  label: string;
  onChangeValue?: (value: T) => void;
  error?: boolean;
  helperText?: string;
}

const CustomSelect = <T,>({
  id,
  options,
  onChangeValue,
  helperText,
  label,
  disabled,
  ...props
}: CustomSelectProps<T>) => {
  const handleChange = (ev: SelectChangeEvent<T>) => {
    onChangeValue?.(ev.target.value as T);
  };

  return (
    <FormControl
      disabled={disabled}
      fullWidth={props.fullWidth ?? true}
      error={props.error}
      size={'medium'}
    >
      <InputLabel id={`${id}--label`}>{label}</InputLabel>
      <Select<T>
        id={`${id}--select`}
        label={label}
        labelId={`${id}--label`}
        MenuProps={{
          style: {
            maxHeight: 500,
          },
        }}
        variant={'outlined'}
        sx={{
          borderRadius: '12px',
        }}
        {...props}
        onChange={handleChange}
      >
        {options.map((op, index) => {
          return (
            <MenuItem
              id={`${id}--menu-item--${index}`}
              key={index}
              value={op.value as string}
            >
              {op.label}
            </MenuItem>
          );
        })}
      </Select>
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
