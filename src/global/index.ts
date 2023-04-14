import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import type { TabState, GlobalState } from "./types";
import { AnimationLevel, NewChatMembersProgress } from "../types";

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
import { ApiChat, ApiChatFolder } from "../api/types/chats";
import { ApiMessage } from "../api/types/messages";
import { ApiGroupCall, ApiPhoneCall } from "../api/types/calls";

export const configAtom = atom<ApiConfig | null>(null);
export const appConfigAtom = atom<ApiAppConfig | null>(null);
export const hasWebAuthTokenFailedAtom = atom<boolean>(false);
export const hasWebAuthTokenPasswordRequiredAtom = atom<boolean>(true);
export const connectionStateAtom = atom<ApiUpdateConnectionStateType | null>(null);
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

export const authStateAtom = atom<ApiUpdateAuthorizationStateType | null>(null);
export const authPhoneNumberAtom = atom<string | null>(null);
export const authIsLoadingAtom = atom<boolean>(false);
export const authIsLoadingQrCodeAtom = atom<boolean>(false);
export const authErrorAtom = atom<string | null>(null);
export const authRememberMeAtom = atom<boolean>(false);
export const authNearestCountryAtom = atom<string | null>(null);
export const authIsCodeViaAppAtom = atom<boolean>(false);
export const authHintAtom = atom<string | null>(null);
export const authQrCodeAtom = atom<{
  token: string;
  expires: number;
} | null>(null);

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
