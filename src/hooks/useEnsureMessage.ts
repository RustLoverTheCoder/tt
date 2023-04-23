import { useEffect, useMemo } from "react";
import type { ApiMessage } from "../api/types";
import { loadMessage } from "../global/actions";

import { throttle } from "../util/schedulers";

const useEnsureMessage = (
  chatId: string,
  messageId?: number,
  message?: ApiMessage,
  replyOriginForId?: number
) => {
  const loadMessageThrottled = useMemo(() => {
    const throttled = throttle(loadMessage, 500, true);
    return () => {
      throttled({
        chatId,
        messageId: messageId!,
        replyOriginForId: replyOriginForId!,
      });
    };
  }, [loadMessage, chatId, messageId, replyOriginForId]);

  useEffect(() => {
    if (messageId && !message) {
      loadMessageThrottled();
    }
  });
};

export default useEnsureMessage;
