import { useLayoutEffect, useRef } from 'react';

const useFirstRender = () => {
  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    }
  }, []);

  return {
    isFirstRender: firstUpdate.current,
  };
};

export default useFirstRender;
