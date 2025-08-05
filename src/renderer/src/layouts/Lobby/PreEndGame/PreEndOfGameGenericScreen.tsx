import { LoadingScreen } from '@render/components/LoadingScreen';
import { useEffect } from 'react';

interface PreEndOfGameGenericScreenProps {
  currentSequence: string;
  toNext: () => void;
}

export const PreEndOfGameGenericScreen = ({
  currentSequence,
  toNext,
}: PreEndOfGameGenericScreenProps) => {
  useEffect(() => {
    if (currentSequence) toNext();
  }, [currentSequence]);
  return <LoadingScreen fullArea />;
};
