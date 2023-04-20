import { useMemo } from 'react';

import type { ApiSendMessageAction } from '../api/types';

import { SEND_MESSAGE_ACTION_INTERVAL } from '../config';
import { sendMessageAction } from '../global/actions';
import { throttle } from '../util/schedulers';

const useSendMessageAction = (chatId?: string, threadId?: number) => {
  return useMemo(() => {
    return throttle((action: ApiSendMessageAction) => {
      if (!chatId || !threadId) return;
      sendMessageAction({ chatId, threadId, action });
    }, SEND_MESSAGE_ACTION_INTERVAL);
  }, [chatId, threadId]);
};

export default useSendMessageAction;
