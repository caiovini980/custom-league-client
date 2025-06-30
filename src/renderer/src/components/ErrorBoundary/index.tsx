import { PropsWithChildren, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorScreen from './ErrorScreen';
import { useNavigate } from 'react-router-dom';
import { electronHandle } from '@render/utils/electronFunction.util';

export interface CustomErrorBoundaryProps {
  btnLabel?: string;
}

const CustomErrorBoundary = ({
  children,
  btnLabel,
}: PropsWithChildren<CustomErrorBoundaryProps>) => {
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    setHasError(true);
    electronHandle.client.changeShowClient(true);
    return (
      <ErrorScreen
        message={error.message}
        onClickTry={resetErrorBoundary}
        btnLabel={btnLabel}
      />
    );
  };

  const onResetError = () => {
    setHasError(false);
    navigate('/');
  };

  return (
    <ErrorBoundary
      fallback={undefined}
      FallbackComponent={ErrorFallback}
      onReset={onResetError}
      resetKeys={[hasError]}
    >
      {children}
    </ErrorBoundary>
  );
};

export { ErrorScreen };

export default CustomErrorBoundary;
