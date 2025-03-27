import { useCallback, useEffect, useRef, useState } from 'react';

export const useTimer = () => {
  const timerRef = useRef<NodeJS.Timeout>();
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setTime((state) => state + 1);
      }, 1000);
    } else {
      clearIntervalTimer();
    }
  }, [isPaused]);

  useEffect(
    () => () => {
      clearIntervalTimer();
    },
    [],
  );

  const clearIntervalTimer = useCallback(() => {
    if (timerRef.current) return clearTimeout(timerRef.current);
  }, []);

  const stopTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  const startTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTime(() => 0);
  }, []);

  const stopAndResetTimer = useCallback(() => {
    stopTimer();
    resetTimer();
  }, [stopTimer, resetTimer]);

  return {
    time,
    stopTimer,
    startTimer,
    resetTimer,
    stopAndResetTimer,
    isTimerPaused: isPaused,
  };
};
