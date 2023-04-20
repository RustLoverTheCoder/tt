import { useRef } from 'react';
import generateIdFor from '../util/generateIdFor';

const store: Record<string, boolean> = {};

const useUniqueId = () => {
  const idRef = useRef<string>();

  if (!idRef.current) {
    idRef.current = generateIdFor(store);
    store[idRef.current] = true;
  }

  return idRef.current;
};

export default useUniqueId;
