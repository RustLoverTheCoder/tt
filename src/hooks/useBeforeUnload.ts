import { useEffect } from 'react';

import { onBeforeUnload } from '../util/schedulers';

import { useLastCallback } from './useLastCallback';

export default function useBeforeUnload(callback: AnyToVoidFunction) {
  const lastCallback = useLastCallback(callback);

  useEffect(() => onBeforeUnload(lastCallback), [lastCallback]);
}
