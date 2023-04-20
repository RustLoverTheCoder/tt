import { ApiKeyboardButton } from "../api/types";

export const disableHistoryAnimations = () => {};

export const returnToAuthPhoneNumber = () => {};

export const goToAuthQrCode = () => {};

export const setSettingOption = (params: any) => {
  console.log("params", params);
};

export const openChat = (params: any) => {
  console.log("params", params);
};

export const openChatByUsername = (params: any) => {
  console.log("params", params);
};

export const openUrl = (params: any) => {
  console.log("params", params);
};

export const clearAuthError = (params: any) => {
  console.log("params", params);
};

export const setAuthCode = (params: any) => {
  console.log("params", params);
};

export const openChatByInvite = (params: any) => {};

export const openChatByPhoneNumber = (params: any) => {};

export const openStickerSet = (params: any) => {};

export const focusMessage = (params: any) => {};

export const joinVoiceChatByLink = (params: any) => {};

export const openInvoice = (params: any) => {};

export const processAttachBotParameters = (params: any) => {};

export const openChatWithDraft = (params: any) => {};

export const showDialog = (params: any) => {};

export const interactWithAnimatedEmoji = (params: any) => {};

export const sendWatchingEmojiInteraction = (params: any) => {};

export const sendEmojiInteraction = (params: any) => {};

export const requestMasterAndJoinGroupCall = (params: any) => {};

export const loadCustomEmojis = (params: any) => {};

export const updateLastRenderedCustomEmojis = (params: any) => {};

export const showNotification = ({ message }: { message: string }) => {};

export const callAttachBot = (params: any) => {};

export const toggleAttachBot = (params: any) => {};

export const loadFullUser = (params: any) => {};

export const addRecentCustomEmoji = (params: any) => {};

export const addRecentEmoji = (params: any) => {};

export const updateAttachmentSettings = (params: any) => {};

export const loadPremiumSetStickers = () => {};

export const loadFeaturedEmojiStickers = () => {};

export const sendBotCommand = ({ command }: { command: string }) => {};

export const setLocalTextSearchQuery = ({ query }: { query: string }) => {};

export const searchTextMessagesLocal = () => {};

export const clickBotInlineButton = ({
  messageId,
  button,
}: {
  messageId: number;
  button: ApiKeyboardButton;
}) => {};

export const deleteDeviceToken = () => {};

export const setReplyingToId = ({ messageId }: { messageId: number }) => {};

export const sendDefaultReaction = ({
  chatId,
  messageId,
}: {
  chatId: string;
  messageId: number;
}) => {};

export const translateMessages = (params: any) => {};


export const openMediaViewer = (params: any) => {};

export const openAudioPlayer = (params: any) => {};

export const markMessagesRead = (params: any) => {};

export const cancelSendingMessage = (params: any) => {};

export const sendPollVote = (params: any) => {};

export const openForwardMenu = (params: any) => {};

export const focusMessageInComments = (params: any) => {};

export const openMessageLanguageModal = (params: any) => {};