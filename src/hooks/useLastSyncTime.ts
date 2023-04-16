import { useEffect } from "react";
import { addCallback } from "../lib/Reactn";

import type { GlobalState } from "../global/types";
import { useAtom } from "jotai";
import { lastSyncTimeAtom } from "../global";

type LastSyncTimeSetter = (time: number) => void;

const handlers = new Set<LastSyncTimeSetter>();
let prevGlobal: GlobalState | undefined;

addCallback((global: GlobalState) => {
  if (global.lastSyncTime && global.lastSyncTime !== prevGlobal?.lastSyncTime) {
    for (const handler of handlers) {
      handler(global.lastSyncTime);
    }
  }

  prevGlobal = global;
});

export default function useLastSyncTime() {
  const [lastSyncTime, setLastSyncTime] = useAtom(lastSyncTimeAtom);

  useEffect(() => {
    handlers.add(setLastSyncTime);

    return () => {
      handlers.delete(setLastSyncTime);
    };
  }, []);

  return lastSyncTime;
}
