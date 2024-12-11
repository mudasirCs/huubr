import { useCallback, useRef } from 'react';

export function useDebounce(delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debounce = useCallback(
    (fn: () => void) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(fn, delay);
    },
    [delay]
  );

  return debounce;
}