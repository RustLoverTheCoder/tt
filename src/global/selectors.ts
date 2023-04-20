export const selectTheme = () => {
  return "light";
};

export const selectIsAlwaysHighPriorityEmoji = (stickerSetInfo: any) => {
  console.log("stickerSetInfo", stickerSetInfo);
  return false;
};

export const selectChatMessage = () => {};
export const selectCurrentMessageList = () => {};

export const selectTopicFromMessage = () => {};

export const selectNotifyExceptions = () => {};

export const selectNotifySettings = () => {};

export const selectUser = () => {};

export const selectIsChatWithSelf = (chatId:string) => {
  return true
}

export const selectChat = () => {}

export const selectTabState = () => {}

export const selectIsCurrentUserPremium = () => {}