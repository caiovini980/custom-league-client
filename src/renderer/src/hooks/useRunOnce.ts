import { useEffect, useRef } from 'react';

export const useRunOnce = (fn: () => void) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      fn();
    }
  }, []);
};
