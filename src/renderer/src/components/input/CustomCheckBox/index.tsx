import { Typography, TypographyProps } from '@mui/material';
import CheckBox, { CheckboxProps } from '@mui/material/Checkbox';
import FormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel';
import { ChangeEvent, ReactNode } from 'react';

export interface CustomCheckBoxProps
  extends Omit<CheckboxProps, 'onChange' | 'value'> {
  label?: ReactNode;
  checked?: boolean;
  variantFont?: TypographyProps['variant'];
  onChange?: (value: boolean) => void;
  formControlLabelProps?: Omit<FormControlLabelProps, 'control' | 'label'>;
}

const CustomCheckBox = ({
  label,
  onChange,
  formControlLabelProps,
  variantFont = 'subtitle2',
  ...props
}: CustomCheckBoxProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    if (!props.readOnly) onChange?.(value);
  };

  const getLabel = () => {
    if (!label) return undefined;
    if (typeof label === 'string' || typeof label === 'number') {
      return (
        <Typography variant={variantFont} color={'textPrimary'}>
          {label}
        </Typography>
      );
    }
    return label;
  };

  return (
    <FormControlLabel
      control={
        <CheckBox
          size={'small'}
          color="primary"
          {...props}
          onChange={handleChange}
        />
      }
      label={getLabel()}
      {...formControlLabelProps}
    />
  );
};

export default CustomCheckBox;
