import { useRef, useEffect } from 'react';
/**
 * Returns a boolean flag to indicate whether the current render is the first render (when the component was mounted).
 */
export const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};
