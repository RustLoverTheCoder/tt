import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import type { TabState, GlobalState, Thread } from "./types";
import {
  AnimationLevel,
  ApiPrivacyKey,
  ApiPrivacySettings,
  ISettings,
  IThemeSettings,
  LangCode,
  NewChatMembersProgress,
  NotifyException,
  ThemeKey,
} from "../types";

import {
  ANIMATION_LEVEL_DEFAULT,
  DARK_THEME_PATTERN_COLOR,
  DEFAULT_MESSAGE_TEXT_SIZE_PX,
  DEFAULT_PATTERN_COLOR,
  DEFAULT_PLAYBACK_RATE,
  DEFAULT_VOLUME,
  IOS_DEFAULT_MESSAGE_TEXT_SIZE_PX,
  MACOS_DEFAULT_MESSAGE_TEXT_SIZE_PX,
} from "../config";
import { IS_IOS, IS_MAC_OS } from "../util/windowEnvironment";
import type {
  ApiAppConfig,
  ApiConfig,
  ApiCountry,
  ApiCountryCode,
} from "../api/types/misc";
import {
  ApiUpdateConnectionStateType,
  ApiUpdateAuthorizationStateType,
} from "../api/types/updates";
import { ApiAttachBot, ApiUser } from "../api/types/users";
import { ApiChat, ApiChatFolder, ApiChatMember } from "../api/types/chats";
import {
  ApiMessage,
  ApiSticker,
  ApiTranscription,
  ApiWebPage,
} from "../api/types/messages";
import { ApiGroupCall, ApiPhoneCall } from "../api/types/calls";
import { focusAtom } from "jotai-optics";

export const configAtom = atom<ApiConfig | null>(null);
export const appConfigAtom = atom<ApiAppConfig | null>(null);
export const hasWebAuthTokenFailedAtom = atom<boolean>(false);
export const hasWebAuthTokenPasswordRequiredAtom = atom<boolean>(true);
export const connectionStateAtom = atom<ApiUpdateConnectionStateType | null>(
  "connectionStateReady"
);
export const currentUserId = atom<string | null>(null);
export const isSyncingAtom = atom<boolean>(false);
export const isUpdateAvailableAtom = atom<boolean>(false);
export const lastSyncTimeAtom = atom<number>(0);
export const leftColumnWidthAtom = atom<number>(0);
export const lastIsChatInfoShownAtom = atom<boolean>(false);
export const initialUnreadNotificationsAtom = atom<number>(0);
export const shouldShowContextMenuHintAtom = atom<boolean>(true);
export const audioPlayerAtom = atom<{
  lastPlaybackRate: number;
  isLastPlaybackRateActive?: boolean;
}>({
  lastPlaybackRate: DEFAULT_PLAYBACK_RATE,
  isLastPlaybackRateActive: false,
});

export const mediaViewerAtom = atom<{ lastPlaybackRate: number }>({
  lastPlaybackRate: DEFAULT_PLAYBACK_RATE,
});

export const recentlyFoundChatIdsAtom = atom<string[]>([]);

export const twoFaSettingsAtom = atom<{
  hint?: string;
  isLoading?: boolean;
  error?: string;
  waitingEmailCodeLength?: number;
}>({
  hint: undefined,
  isLoading: false,
  error: undefined,
  waitingEmailCodeLength: undefined,
});

export const attachmentSettingsAtom = atom<{
  shouldCompress: boolean;
  shouldSendGrouped: boolean;
}>({
  shouldCompress: true,
  shouldSendGrouped: true,
});

export const attachMenuAtom = atom<{
  hash?: string;
  bots: Record<string, ApiAttachBot>;
}>({
  hash: undefined,
  bots: {},
});

export const passcodeAtom = atom<{
  isScreenLocked?: boolean;
  hasPasscode?: boolean;
  error?: string;
  timeoutUntil?: number;
  invalidAttemptsCount?: number;
  invalidAttemptError?: string;
  isLoading?: boolean;
}>({
  isScreenLocked: false,
  hasPasscode: false,
  error: undefined,
  timeoutUntil: undefined,
  invalidAttemptsCount: undefined,
  invalidAttemptError: undefined,
  isLoading: false,
});

export const authStateAtom = atom<ApiUpdateAuthorizationStateType | null>(
  "authorizationStateWaitQrCode"
);
export const authPhoneNumberAtom = atom<string | null>(null);
export const authIsLoadingAtom = atom<boolean>(false);
export const authIsLoadingQrCodeAtom = atom<boolean>(false);
export const authErrorAtom = atom<string | null>(null);
export const authRememberMeAtom = atom<boolean>(false);
export const authNearestCountryAtom = atom<string | null>(null);
export const authIsCodeViaAppAtom = atom<boolean>(false);
export const authHintAtom = atom<string | null>(null);

// todo
export const authQrCodeAtom = atom<{
  token: string;
  expires: number;
} | null>({
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  expires: 1516239022,
});

export const countryListAtom = atom<{
  phoneCodes: ApiCountryCode[];
  general: ApiCountry[];
} | null>(null);

export const contactListAtom = atom<{
  userIds: string[];
} | null>(null);

export const blockedAtom = atom<{
  ids: string[];
  totalCount: number;
} | null>(null);

export const userFamily = atomFamily(
  (user: ApiUser) => atom(user),
  (a, b) => a.id === b.id
);

export const chatFamily = atomFamily(
  (chat: ApiChat) => atom(chat),
  (a, b) => a.id === b.id
);

export const messageFamily = atomFamily(
  (message: ApiMessage) => atom(message),
  (a, b) => a.id === b.id
);

export const groupCallFamily = atomFamily(
  (groupCall: ApiGroupCall) => atom(groupCall),
  (a, b) => a.id === b.id
);

export const scheduledMessageFamily = atomFamily(
  (message: ApiMessage) => atom(message),
  (a, b) => a.id === b.id
);

export const chatFolderFamily = atomFamily(
  (folder: ApiChatFolder) => atom(folder),
  (a, b) => a.id === b.id
);

export const phoneCallAtom = atom<ApiPhoneCall | null>(null);

export const fileUploadFamily = atomFamily(
  (fileUpload: { id: string; progress: number }) => atom(fileUpload),
  (a, b) => a.id === b.id
);

export const recentEmojisAtom = atom<string[]>([]);
export const recentCustomEmojisAtom = atom<string[]>([]);

export const animationLevelAtom = atom<AnimationLevel>(0);

export const settingsAtom = atom<ISettings>({
  theme: "light",
  shouldUseSystemTheme: true,
  messageTextSize: IS_IOS
    ? IOS_DEFAULT_MESSAGE_TEXT_SIZE_PX
    : IS_MAC_OS
    ? MACOS_DEFAULT_MESSAGE_TEXT_SIZE_PX
    : DEFAULT_MESSAGE_TEXT_SIZE_PX,
  animationLevel: ANIMATION_LEVEL_DEFAULT,
  messageSendKeyCombo: "enter",
  canAutoLoadPhotoFromContacts: true,
  canAutoLoadPhotoInPrivateChats: true,
  canAutoLoadPhotoInGroups: true,
  canAutoLoadPhotoInChannels: true,
  canAutoLoadVideoFromContacts: true,
  canAutoLoadVideoInPrivateChats: true,
  canAutoLoadVideoInGroups: true,
  canAutoLoadVideoInChannels: true,
  canAutoLoadFileFromContacts: false,
  canAutoLoadFileInPrivateChats: false,
  canAutoLoadFileInGroups: false,
  canAutoLoadFileInChannels: false,
  autoLoadFileMaxSizeMb: 10,
  hasWebNotifications: true,
  hasPushNotifications: true,
  notificationSoundVolume: 5,
  canAutoPlayGifs: true,
  canAutoPlayVideos: true,
  shouldSuggestStickers: true,
  shouldSuggestCustomEmoji: true,
  shouldLoopStickers: true,
  language: "en",
  timeFormat: "24h",
  wasTimeFormatSetManually: false,
  isConnectionStatusMinimized: true,
  shouldArchiveAndMuteNewNonContact: false,
  canTranslate: false,
  canTranslateChats: true,
  doNotTranslate: [],
  canDisplayChatInTitle: true,
});

export const notificationSoundVolumeAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop("notificationSoundVolume")
);
export const themeAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop("theme")
);
export const shouldSuggestCustomEmojiAtom = focusAtom(settingsAtom, (optic) =>
  optic.prop("shouldSuggestCustomEmoji")
);

export const languageAtom = atom(
  (get) => get(settingsAtom).language,
  (get, set, language: LangCode) => {
    set(settingsAtom, { ...get(settingsAtom), language });
  }
);

export const themesAtom = atom<Partial<Record<ThemeKey, IThemeSettings>>>({
  light: {
    isBlurred: true,
    patternColor: DEFAULT_PATTERN_COLOR,
  },
  dark: {
    isBlurred: true,
    patternColor: DARK_THEME_PATTERN_COLOR,
  },
});

export const privacyAtom = atom<
  Partial<Record<ApiPrivacyKey, ApiPrivacySettings>>
>({});

export const notifyExceptionsAtom = atom<Record<number, NotifyException>>({});

export const customEmojisAtom = atom<{
  added: {
    hash?: string;
    setIds?: string[];
  };
  lastRendered: string[];
  byId: Record<string, ApiSticker>;
  forEmoji: {
    emoji?: string;
    stickers?: ApiSticker[];
  };
  featuredIds?: string[];
  statusRecent: {
    hash?: string;
    emojis?: ApiSticker[];
  };
}>({
  lastRendered: [],
  byId: {},
  added: {},
  forEmoji: {},
  statusRecent: {},
});

export const transcriptionsAtom = atom<Record<string, ApiTranscription>>({});

export const currentUserIdAtom = atom<string>("");

export const isLeftColumnShownAtom = atom<boolean>(true);

// todo
export const isCurrentUserPremiumAtom = atom<boolean>(false);

export const usersByIdAtom = atom<Record<string, ApiUser>>({});

// 当前消息
export const currentMessageAtom = atom<ApiMessage | null>(null);

// 当前聊天 或者是当前消息的聊天列表
export const currentChatAtom = atom<ApiChat | null>(null);

export const webPagePreviewAtom = atom<ApiWebPage | null>(null);

export const ThreadAtom = atom<Thread>({
  noWebPage: true,
});

export const noWebPageAtom = focusAtom(ThreadAtom, (optic) =>
  optic.prop("noWebPage")
);

export const groupChatMembersAtom = atom<ApiChatMember[]>([]);

export const baseEmojiKeywordsAtom = atom<Record<string, string[]>>({});

export const emojiKeywordsAtom = atom<Record<string, string[]>>({});

export const customEmojiForEmojiAtom = atom<ApiSticker[]>([]);

export const captionLimitAtom = atom<number>(0);

export const replyingToIdAtom = atom<number | null>(null);

export const editingIdAtom = atom<number | null>(null);

export const messageAtom = atom<ApiMessage | null>(null);

export const senderAtom = atom<ApiUser | ApiChat | null>(null);

export const shouldAnimateAtom = atom<boolean>(true);

export const forwardedMessagesCountAtom = atom<number>(0);

export const noAuthorsAtom = atom<boolean>(false);

export const noCaptionsAtom = atom<boolean>(false);

export const forwardsHaveCaptionsAtom = atom<boolean>(false);

export const phoneCodeListAtom = atom<ApiCountryCode[]>([
  {
    isHidden: false,
    iso2: "US",
    defaultName: "United States",
    name: "United States",
    countryCode: "1",
    prefixes: [""],
    patterns: [
      "^(\\d{10}|\\d{3}-\\d{3}-\\d{4}|\\(\\d{3}\\)\\s*\\d{3}-\\d{4}|\\(\\d{3}\\)\\d{3}-\\d{4}|\\d{3}\\s*\\d{3}\\s*\\d{4})$",
    ],
  },
  {
    isHidden: false,
    iso2: "CN",
    defaultName: "China",
    name: "China",
    countryCode: "86",
    prefixes: ["13", "15", "18"],
    patterns: ["^1(3|5|8)\\d{9}$"],
  },
  {
    isHidden: false,
    iso2: 'HK',
    defaultName: 'Hong Kong',
    name: 'Hong Kong',
    countryCode: '852',
    prefixes: ['5', '6', '9'],
    patterns: ['^([569]\\d{3}\\s?\\d{4})|(6\\d{3}\\s?\\d{3})$'],
  }
]);
