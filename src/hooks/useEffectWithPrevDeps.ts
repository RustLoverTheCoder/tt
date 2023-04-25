import { useEffect, useRef } from "react";

type Callback<T extends any[]> = (prevDeps: T, changedDeps: T) => void;

function useEffectWithPrevDeps<T extends any[]>(callback: Callback<T>, dependencies: T) {
  const prevDependenciesRef = useRef<T>(dependencies);

  useEffect(() => {
    const prevDependencies = prevDependenciesRef.current;
    const changedDependencies = dependencies.filter(
      (dep, index) => dep !== prevDependencies[index]
    ) as T;
    if (changedDependencies.length > 0) {
      callback(prevDependencies, changedDependencies);
    }
    prevDependenciesRef.current = dependencies;
  });
}

export default useEffectWithPrevDeps;
