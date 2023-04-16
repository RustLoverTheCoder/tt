import { useEffect } from 'react';
import usePrevious from './usePrevious';

const useEffectWithPrevDeps = <T extends readonly any[]>(
  cb: (prevDeps: T, currentDeps: T) => void,
  dependencies: T,
  debugKey?: string,
) => {
  const prevDeps = usePrevious(dependencies);
  useEffect(() => {
    // @ts-ignore
    cb(prevDeps, dependencies);
  }, [debugKey, ...dependencies]);
};

export default useEffectWithPrevDeps;