import { Slide } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent, { DialogContentProps } from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import {
  FormEvent,
  PropsWithChildren,
  ReactNode,
  Ref,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LoadingScreen } from '../LoadingScreen';
import CustomButton from '../input/CustomButton';
import { CustomButtonProps } from '../input/CustomButton';
import { FaTimes } from 'react-icons/fa';
import { CustomIconButton } from '@render/components/input';

type Color =
  | 'initial'
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'textPrimary'
  | 'textSecondary'
  | 'error';

export interface CustomDialogProps
  extends Omit<DialogProps, 'open' | 'onClose' | 'title'> {
  open: boolean;
  title?: string | ReactNode;
  description?: string;
  dialogContentProps?: DialogContentProps;
  labelBtnConfirm?: string;
  labelBtnCancel?: string;
  loading?: boolean;
  loadingText?: string;
  actionsComponent?: ReactNode;
  color?: Color;
  handleConfirm?: () => void;
  handleClose?: () => void;
  confirmButtonProps?: Omit<CustomButtonProps, 'id'>;
  cancelButtonProps?: Omit<CustomButtonProps, 'id'>;
  hiddenBtnConfirm?: boolean;
  hiddenBtnCancel?: boolean;
  hiddenTitle?: boolean;
  closeOnClickBackDrop?: boolean;
  borderSpacing?: number;
  delayConfirm?: number;
  otherActionButton?: ReactNode;
}

const CustomDialog = ({
  open,
  title,
  description,
  labelBtnConfirm,
  dialogContentProps,
  labelBtnCancel,
  handleConfirm,
  handleClose,
  loading,
  loadingText = 'Loading...',
  actionsComponent: ActionsComponent,
  hiddenTitle = false,
  closeOnClickBackDrop = false,
  hiddenBtnCancel,
  hiddenBtnConfirm,
  confirmButtonProps,
  cancelButtonProps,
  borderSpacing = 1,
  delayConfirm,
  color = 'textSecondary',
  otherActionButton: OtherActionButton,
  children,
  ...props
}: PropsWithChildren<CustomDialogProps>) => {
  const { spacing, palette } = useTheme();
  const interval = useRef<NodeJS.Timeout>();
  const [currentDelay, setCurrentDelay] = useState<number>();
  const [enableBtnConfirm, setEnableConfirm] = useState(false);
  const isDarkTheme = palette.mode === 'dark';
  const onClose: DialogProps['onClose'] = (_, reason) => {
    if (
      (reason !== 'backdropClick' && reason !== 'escapeKeyDown') ||
      (reason === 'backdropClick' && closeOnClickBackDrop)
    ) {
      handleClose?.();
    }
  };

  // @ts-ignore
  useEffect(() => {
    if (delayConfirm && delayConfirm > 0) {
      setEnableConfirm(false);
      setCurrentDelay(delayConfirm);
      interval.current = setInterval(() => {
        setCurrentDelay((prev) => (prev || 1) - 1);
      }, 1000);

      return () => {
        clearIntervalBtn();
      };
    }
    setEnableConfirm(true);
    if (!open) {
      setEnableConfirm(false);
      clearIntervalBtn();
    }
  }, [open, delayConfirm]);

  useEffect(() => {
    if (currentDelay !== undefined && currentDelay === 0) {
      setEnableConfirm(true);
      clearIntervalBtn();
    }
  }, [currentDelay]);

  const clearIntervalBtn = () => {
    if (interval.current) clearInterval(interval.current);
  };

  const btnConfirmLabel = () => {
    if (currentDelay !== undefined && currentDelay > 0) {
      return `Wait ${currentDelay} sec`;
    }
    return labelBtnConfirm || 'Accept';
  };

  return (
    <Dialog
      {...props}
      open={open}
      onClose={onClose}
      onSubmit={(event: FormEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      slots={{
        transition: Transition,
      }}
    >
      {loading && <LoadingScreen backdrop loadingText={loadingText} />}
      {!hiddenTitle &&
        (typeof title === 'string' ? (
          <DialogTitle
            sx={{
              padding: borderSpacing,
              fontSize: (t) => t.typography.subtitle1,
              color: 'primary.main',
            }}
          >
            {title}
          </DialogTitle>
        ) : (
          title
        ))}
      <DialogContent
        sx={{
          padding: spacing(borderSpacing),
          display: 'flex',
        }}
        {...dialogContentProps}
      >
        {children || (
          <DialogContentText
            style={{
              color: isDarkTheme ? color : 'black',
              whiteSpace: 'pre-wrap',
            }}
          >
            {description || 'Do you really want to take this action?'}
          </DialogContentText>
        )}
      </DialogContent>
      {ActionsComponent || (
        <DialogActions
          style={{ padding: spacing(borderSpacing), justifyContent: 'center' }}
        >
          {OtherActionButton}
          {!hiddenBtnCancel && (
            <CustomButton
              id={'3203ce71-aa62-4eae-9990-2387a407024a'}
              onClick={() => handleClose?.()}
              color="error"
              variant={'outlined'}
              {...cancelButtonProps}
              disabled={loading || cancelButtonProps?.disabled}
            >
              {labelBtnCancel || 'Decline'}
            </CustomButton>
          )}
          {!hiddenBtnConfirm && (
            <CustomButton
              id={'e4569ddf-0d19-4b39-b386-4bdbd26e4fe1'}
              onClick={() => handleConfirm?.()}
              color="primary"
              autoFocus
              variant={'contained'}
              {...confirmButtonProps}
              disabled={
                loading || !enableBtnConfirm || confirmButtonProps?.disabled
              }
            >
              {btnConfirmLabel()}
            </CustomButton>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface CustomDialogCloseFloatingButtonProps {
  handleClose: () => void;
  margin?: number;
}

export const CustomDialogCloseFloatingButton = ({
  handleClose,
  margin = 8,
}: CustomDialogCloseFloatingButtonProps) => {
  return (
    <CustomIconButton
      onClick={() => handleClose()}
      sx={{
        position: 'absolute',
        top: margin,
        right: margin,
        zIndex: 2,
        p: 1,
      }}
    >
      <FaTimes size={20} />
    </CustomIconButton>
  );
};

export default CustomDialog;
