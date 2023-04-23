import type { FC } from 'react';
import React, { useCallback, memo } from 'react';

import type { ApiMessage } from '../../api/types';
import type { IAlbum } from '../../types';
import renderText from './helpers/renderText';
import useLang from '../../hooks/useLang';

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { deleteMessages, deleteScheduledMessages } from '../../global/actions';

export type OwnProps = {
  isOpen: boolean;
  isSchedule: boolean;
  message: ApiMessage;
  album?: IAlbum;
  onClose: NoneToVoidFunction;
  onConfirm?: NoneToVoidFunction;
};

type StateProps = {
  canDeleteForAll?: boolean;
  contactName?: string;
  willDeleteForCurrentUserOnly?: boolean;
  willDeleteForAll?: boolean;
};

const DeleteMessageModal: FC<OwnProps> = ({
  isOpen,
  isSchedule,
  message,
  album,
  onConfirm,
  onClose,
}) => {
  //todo
  const canDeleteForAll = true
  const contactName = ''
  const willDeleteForCurrentUserOnly = false
  const willDeleteForAll = false

  const handleDeleteMessageForAll = useCallback(() => {
    onConfirm?.();
    const messageIds = album?.messages
      ? album.messages.map(({ id }) => id)
      : [message.id];
    deleteMessages({ messageIds, shouldDeleteForAll: true });
    onClose();
  }, [onConfirm, album, message.id, deleteMessages, onClose]);

  const handleDeleteMessageForSelf = useCallback(() => {
    onConfirm?.();
    const messageIds = album?.messages
      ? album.messages.map(({ id }) => id)
      : [message.id];
    if (isSchedule) {
      deleteScheduledMessages({ messageIds });
    } else {
      deleteMessages({
        messageIds,
        shouldDeleteForAll: false,
      });
    }
    onClose();
  }, [onConfirm, album, message.id, isSchedule, onClose, deleteScheduledMessages, deleteMessages]);

  const lang = useLang();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onEnter={isOpen && !canDeleteForAll ? handleDeleteMessageForSelf : undefined}
      className="delete"
      title={lang('DeleteSingleMessagesTitle')}
    >
      <p>{lang('AreYouSureDeleteSingleMessage')}</p>
      {willDeleteForCurrentUserOnly && (
        <p>{lang('lng_delete_for_me_chat_hint', 1, 'i')}</p>
      )}
      {willDeleteForAll && (
        <p>{lang('lng_delete_for_everyone_hint', 1, 'i')}</p>
      )}
      <div className={canDeleteForAll ? 'dialog-buttons-column' : 'dialog-buttons'}>
        {canDeleteForAll && (
          <Button color="danger" className="confirm-dialog-button" isText onClick={handleDeleteMessageForAll}>
            {contactName && renderText(lang('Conversation.DeleteMessagesFor', contactName))}
            {!contactName && lang('Conversation.DeleteMessagesForEveryone')}
          </Button>
        )}
        <Button color="danger" className="confirm-dialog-button" isText onClick={handleDeleteMessageForSelf}>
          {lang(canDeleteForAll ? 'ChatList.DeleteForCurrentUser' : 'Delete')}
        </Button>
        <Button className="confirm-dialog-button" isText onClick={onClose}>{lang('Cancel')}</Button>
      </div>
    </Modal>
  );
};

// export default memo(withGlobal<OwnProps>(
//   (global, { message, isSchedule }): StateProps => {
//     const { threadId } = selectCurrentMessageList(global) || {};
//     const { canDeleteForAll } = (threadId && selectAllowedMessageActions(global, message, threadId)) || {};
//     const chat = selectChat(global, message.chatId);
//     const contactName = chat && isUserId(chat.id)
//       ? getUserFirstOrLastName(selectUser(global, getPrivateChatUserId(chat)!))
//       : undefined;

//     const willDeleteForCurrentUserOnly = chat && isChatBasicGroup(chat) && !canDeleteForAll;
//     const willDeleteForAll = chat && isChatSuperGroup(chat);

//     return {
//       canDeleteForAll: !isSchedule && canDeleteForAll,
//       contactName,
//       willDeleteForCurrentUserOnly,
//       willDeleteForAll,
//     };
//   },
// )(DeleteMessageModal));

export default memo(DeleteMessageModal)