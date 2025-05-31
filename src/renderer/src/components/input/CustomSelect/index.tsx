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
  extends Omit<SelectProps<T>, 'onChange'> {
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
  options,
  onChangeValue,
  helperText,
  label,
  disabled,
  size = 'small',
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
      size={size}
    >
      <InputLabel id={'label'}>{label}</InputLabel>
      <Select<T>
        label={label}
        labelId={'label'}
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
            <MenuItem key={index} value={op.value as string}>
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
