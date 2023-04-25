import { useEffect, useRef } from 'react';

function usePrevious<T extends any>(next: T): T | undefined;
function usePrevious<T extends any>(next: T, shouldSkipUndefined: true): Exclude<T, undefined> | undefined;
function usePrevious<T extends any>(next: T, shouldSkipUndefined?: boolean): Exclude<T, undefined> | undefined;
function usePrevious<T extends any>(next: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = next;
  }, [next]);
  return ref.current;
}

export default usePrevious;
