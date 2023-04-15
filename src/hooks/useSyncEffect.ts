import { useEffect, useRef } from 'react';

const useSyncEffect = <T extends readonly any[]>(cb: (args: T | readonly []) => void, dependencies: T) => {
  const prevDepsRef = useRef<T | undefined>(undefined);

  useEffect(() => {
    if (!prevDepsRef.current || dependencies.some((d, i) => d !== prevDepsRef.current?.[i])) {
      cb(prevDepsRef.current || []);
    }
    prevDepsRef.current = dependencies;
  }, dependencies);
};

export default useSyncEffect;