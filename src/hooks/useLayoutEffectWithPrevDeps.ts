import { useLayoutEffect } from 'react';
import usePrevious from './usePrevious';

const useLayoutEffectWithPrevDeps = <T>(
  cb: (args: T | readonly []) => void, dependencies: T, debugKey?: string,
) => {
  const prevDeps = usePrevious<T>(dependencies);
  return useLayoutEffect(() => {
    return cb(prevDeps || []);
    // @ts-ignore
  }, dependencies);
};

export default useLayoutEffectWithPrevDeps;
