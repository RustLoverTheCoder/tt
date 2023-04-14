import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import type { TabState, GlobalState } from "./types";
import { NewChatMembersProgress } from "../types";

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

const configAtom = atom<ApiConfig | null>(null);
const appConfigAtom = atom<ApiAppConfig | null>(null);
const hasWebAuthTokenFailedAtom = atom<boolean>(false);
const hasWebAuthTokenPasswordRequiredAtom = atom<boolean>(true);
const connectionStateAtom = atom<ApiUpdateConnectionStateType | null>(null);
const currentUserId = atom<string | null>(null);
const isSyncingAtom = atom<boolean>(false);
const isUpdateAvailableAtom = atom<boolean>(false);
const lastSyncTimeAtom = atom<number>(0);
const leftColumnWidthAtom = atom<number>(0);
const lastIsChatInfoShownAtom = atom<boolean>(false);
const initialUnreadNotificationsAtom = atom<number>(0);
const shouldShowContextMenuHintAtom = atom<boolean>(true);
const audioPlayerAtom = atom<{
  lastPlaybackRate: number;
  isLastPlaybackRateActive?: boolean;
}>({
  lastPlaybackRate: DEFAULT_PLAYBACK_RATE,
  isLastPlaybackRateActive: false,
});

const mediaViewerAtom = atom<{ lastPlaybackRate: number }>({
  lastPlaybackRate: DEFAULT_PLAYBACK_RATE,
});

const recentlyFoundChatIdsAtom = atom<string[]>([]);

const twoFaSettingsAtom = atom<{
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

const attachmentSettingsAtom = atom<{
  shouldCompress: boolean;
  shouldSendGrouped: boolean;
}>({
  shouldCompress: true,
  shouldSendGrouped: true,
});

const attachMenuAtom = atom<{
  hash?: string;
  bots: Record<string, ApiAttachBot>;
}>({
  hash: undefined,
  bots: {},
});

const passcodeAtom = atom<{
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

const authStateAtom = atom<ApiUpdateAuthorizationStateType | null>(null);
const authPhoneNumberAtom = atom<string | null>(null);
const authIsLoadingAtom = atom<boolean>(false);
const authIsLoadingQrCodeAtom = atom<boolean>(false);
const authErrorAtom = atom<string | null>(null);
const authRememberMeAtom = atom<boolean>(false);
const authNearestCountryAtom = atom<string | null>(null);
const authIsCodeViaAppAtom = atom<boolean>(false);
const authHintAtom = atom<string | null>(null);
const authQrCodeAtom = atom<{
  token: string;
  expires: number;
} | null>(null);

const countryListAtom = atom<{
  phoneCodes: ApiCountryCode[];
  general: ApiCountry[];
} | null>(null);

const contactListAtom = atom<{
  userIds: string[];
} | null>(null);

const blockedAtom = atom<{
  ids: string[];
  totalCount: number;
} | null>(null);

const userFamily = atomFamily(
  (user: ApiUser) => atom(user),
  (a, b) => a.id === b.id
);

const chatFamily = atomFamily(
  (chat: ApiChat) => atom(chat),
  (a, b) => a.id === b.id
);

const messageFamily = atomFamily(
  (message: ApiMessage) => atom(message),
  (a, b) => a.id === b.id
);

const groupCallFamily = atomFamily(
  (groupCall: ApiGroupCall) => atom(groupCall),
  (a, b) => a.id === b.id
);

const scheduledMessageFamily = atomFamily(
  (message: ApiMessage) => atom(message),
  (a, b) => a.id === b.id
);

const chatFolderFamily = atomFamily(
  (folder: ApiChatFolder) => atom(folder),
  (a, b) => a.id === b.id
);

const phoneCallAtom = atom<ApiPhoneCall | null>(null);

const fileUploadFamily = atomFamily(
  (fileUpload: { id: string; progress: number }) => atom(fileUpload),
  (a, b) => a.id === b.id
);

const recentEmojisAtom = atom<string[]>([]);
const recentCustomEmojisAtom = atom<string[]>([]);