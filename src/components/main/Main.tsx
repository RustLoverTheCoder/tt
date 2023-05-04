import type { FC } from "react";
import {
  useEffect,
  memo,
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { requestNextMutation } from "../../lib/fasterdom/fasterdom";
import type { LangCode } from "../../types";
import type {
  ApiAttachBot,
  ApiChat,
  ApiChatFolder,
  ApiMessage,
  ApiUser,
} from "../../api/types";
import type { ApiLimitTypeWithModal, TabState } from "../../global/types";

import { BASE_EMOJI_KEYWORD_LANG, DEBUG, INACTIVE_MARKER } from "../../config";
import { IS_ANDROID } from "../../util/windowEnvironment";
import clsx from "clsx";
import { waitForTransitionEnd } from "../../util/cssAnimationEndListeners";
import { processDeepLink } from "../../util/deeplink";
import {
  parseInitialLocationHash,
  parseLocationHash,
} from "../../util/routing";
import { Bundles, loadBundle } from "../../util/moduleLoader";
import updateIcon from "../../util/updateIcon";

import useEffectWithPrevDeps from "../../hooks/useEffectWithPrevDeps";
import useBackgroundMode from "../../hooks/useBackgroundMode";
import useBeforeUnload from "../../hooks/useBeforeUnload";
import useSyncEffect from "../../hooks/useSyncEffect";
import usePreventPinchZoomGesture from "../../hooks/usePreventPinchZoomGesture";
import useForceUpdate from "../../hooks/useForceUpdate";
import useShowTransition from "../../hooks/useShowTransition";
import { dispatchHeavyAnimationEvent } from "../../hooks/useHeavyAnimationCheck";
import useInterval from "../../hooks/useInterval";
import useAppLayout from "../../hooks/useAppLayout";
import useTimeout from "../../hooks/useTimeout";
import useFlag from "../../hooks/useFlag";

import StickerSetModal from "../common/StickerSetModal.async";
import UnreadCount from "../common/UnreadCounter";
import LeftColumn from "../left/LeftColumn";
import MiddleColumn from "../middle/MiddleColumn";
import RightColumn from "../right/RightColumn";
import MediaViewer from "../mediaViewer/MediaViewer.async";
import AudioPlayer from "../middle/AudioPlayer";
import DownloadManager from "./DownloadManager";
import GameModal from "./GameModal";
import Notifications from "./Notifications.async";
import Dialogs from "./Dialogs.async";
import ForwardRecipientPicker from "./ForwardRecipientPicker.async";
import SafeLinkModal from "./SafeLinkModal.async";
import HistoryCalendar from "./HistoryCalendar.async";
import GroupCall from "../calls/group/GroupCall.async";
import ActiveCallHeader from "../calls/ActiveCallHeader.async";
import PhoneCall from "../calls/phone/PhoneCall.async";
import MessageListHistoryHandler from "../middle/MessageListHistoryHandler";
import NewContactModal from "./NewContactModal.async";
import RatePhoneCallModal from "../calls/phone/RatePhoneCallModal.async";
import WebAppModal from "./WebAppModal.async";
import BotTrustModal from "./BotTrustModal.async";
import AttachBotInstallModal from "./AttachBotInstallModal.async";
import ConfettiContainer from "./ConfettiContainer";
import UrlAuthModal from "./UrlAuthModal.async";
import PremiumMainModal from "./premium/PremiumMainModal.async";
import PaymentModal from "../payment/PaymentModal.async";
import ReceiptModal from "../payment/ReceiptModal.async";
import PremiumLimitReachedModal from "./premium/common/PremiumLimitReachedModal.async";
import DeleteFolderDialog from "./DeleteFolderDialog.async";
import CustomEmojiSetsModal from "../common/CustomEmojiSetsModal.async";
import DraftRecipientPicker from "./DraftRecipientPicker.async";
import AttachBotRecipientPicker from "./AttachBotRecipientPicker.async";
import ReactionPicker from "../middle/message/ReactionPicker.async";
import ChatlistModal from "../modals/chatlist/ChatlistModal.async";

import "./Main.scss";
import { useAtom } from "jotai";
import {
  chatIdAtom,
  isCurrentUserPremiumAtom,
  isLeftColumnShownAtom,
  languageAtom,
  lastSyncTimeAtom,
  tabStateAtom,
} from "../../global";

export interface OwnProps {
  isMobile?: boolean;
}

type StateProps = {
  isMasterTab?: boolean;
  chat?: ApiChat;
  lastSyncTime?: number;
  isLeftColumnOpen: boolean;
  isMiddleColumnOpen: boolean;
  isRightColumnOpen: boolean;
  isMediaViewerOpen: boolean;
  isForwardModalOpen: boolean;
  hasNotifications: boolean;
  hasDialogs: boolean;
  audioMessage?: ApiMessage;
  safeLinkModalUrl?: string;
  isHistoryCalendarOpen: boolean;
  shouldSkipHistoryAnimations?: boolean;
  openedStickerSetShortName?: string;
  openedCustomEmojiSetIds?: string[];
  activeGroupCallId?: string;
  isServiceChatReady?: boolean;
  language?: LangCode;
  wasTimeFormatSetManually?: boolean;
  isPhoneCallActive?: boolean;
  addedSetIds?: string[];
  addedCustomEmojiIds?: string[];
  newContactUserId?: string;
  newContactByPhoneNumber?: boolean;
  openedGame?: TabState["openedGame"];
  gameTitle?: string;
  isRatePhoneCallModalOpen?: boolean;
  webApp?: TabState["webApp"];
  isPremiumModalOpen?: boolean;
  botTrustRequest?: TabState["botTrustRequest"];
  botTrustRequestBot?: ApiUser;
  attachBotToInstall?: ApiAttachBot;
  requestedAttachBotInChat?: TabState["requestedAttachBotInChat"];
  requestedDraft?: TabState["requestedDraft"];
  currentUser?: ApiUser;
  urlAuth?: TabState["urlAuth"];
  limitReached?: ApiLimitTypeWithModal;
  deleteFolderDialog?: ApiChatFolder;
  isPaymentModalOpen?: boolean;
  isReceiptModalOpen?: boolean;
  isReactionPickerOpen: boolean;
  isCurrentUserPremium?: boolean;
  chatlistModal?: TabState["chatlistModal"];
  noRightColumnAnimation?: boolean;
  withInterfaceAnimations?: boolean;
};

const APP_OUTDATED_TIMEOUT_MS = 5 * 60 * 1000; // 5 min
const CALL_BUNDLE_LOADING_DELAY_MS = 5000; // 5 sec
const REACTION_PICKER_LOADING_DELAY_MS = 7000; // 7 sec

// eslint-disable-next-line @typescript-eslint/naming-convention
let DEBUG_isLogged = false;

const Main: FC<OwnProps> = ({ isMobile }) => {
  const [isLeftColumnOpen] = useAtom(isLeftColumnShownAtom);

  const [chatId] = useAtom(chatIdAtom);
  const isMiddleColumnOpen = Boolean(chatId);

  const [tabState] = useAtom(tabStateAtom);
  const isMasterTab = !!tabState.isMasterTab;

  const [lastSyncTime] = useAtom(lastSyncTimeAtom);

  const [isCurrentUserPremium] = useAtom(isCurrentUserPremiumAtom);

  const [language] = useAtom(languageAtom);

  const initMain = () => {};
  const loadAnimatedEmojis = () => {};
  const loadNotificationSettings = () => {};
  const loadNotificationExceptions = () => {};
  const updateIsOnline = (params: boolean) => {};
  const onTabFocusChange = () => {};
  const loadTopInlineBots = () => {};
  const loadEmojiKeywords = (params: { language: string }) => {};
  const loadCountryList = (params: { langCode: string }) => {};
  const loadAvailableReactions = () => {};
  const loadStickerSets = () => {};
  const loadPremiumGifts = () => {};
  const loadDefaultTopicIcons = () => {};
  const loadAddedStickers = () => {};
  const loadFavoriteStickers = () => {};
  const loadDefaultStatusIcons = () => {};
  const ensureTimeFormat = () => {};
  const closeStickerSetModal = () => {};
  const closeCustomEmojiSets = () => {};
  const checkVersionNotification = () => {};
  const loadConfig = () => {};
  const loadAppConfig = () => {};
  const loadAttachBots = () => {};
  const loadContactList = () => {};
  const loadCustomEmojis = (params: any) => {};
  const loadGenericEmojiEffects = () => {};
  const closePaymentModal = () => {};
  const clearReceipt = () => {};
  const checkAppVersion = () => {};
  const openChat = () => {};
  const toggleLeftColumn = () => {};
  const loadRecentEmojiStatuses = () => {};
  const updatePageTitle = () => {};
  const loadTopReactions = () => {};
  const loadRecentReactions = () => {};
  const loadFeaturedEmojiStickers = () => {};

  if (DEBUG && !DEBUG_isLogged) {
    DEBUG_isLogged = true;
    // eslint-disable-next-line no-console
    console.log(">>> RENDER MAIN");
  }

  // Preload Calls bundle to initialize sounds for iOS
  useTimeout(() => {
    void loadBundle(Bundles.Calls);
  }, CALL_BUNDLE_LOADING_DELAY_MS);

  const [shouldLoadReactionPicker, markShouldLoadReactionPicker] =
    useFlag(false);
  useTimeout(markShouldLoadReactionPicker, REACTION_PICKER_LOADING_DELAY_MS);

  // eslint-disable-next-line no-null/no-null
  const containerRef = useRef<HTMLDivElement>(null);

  const { isDesktop } = useAppLayout();
  useEffect(() => {
    if (!isLeftColumnOpen && !isMiddleColumnOpen && !isDesktop) {
      // Always display at least one column
      toggleLeftColumn();
    } else if (isLeftColumnOpen && isMiddleColumnOpen && isMobile) {
      // Can't have two active columns at the same time
      toggleLeftColumn();
    }
  }, [
    isDesktop,
    isLeftColumnOpen,
    isMiddleColumnOpen,
    isMobile,
    toggleLeftColumn,
  ]);

  useInterval(
    checkAppVersion,
    isMasterTab ? APP_OUTDATED_TIMEOUT_MS : undefined,
    true
  );

  // Initial API calls
  useEffect(() => {
    if (lastSyncTime && isMasterTab) {
      updateIsOnline(true);
      loadConfig();
      loadAppConfig();
      initMain();
      loadAvailableReactions();
      loadAnimatedEmojis();
      loadGenericEmojiEffects();
      loadNotificationSettings();
      loadNotificationExceptions();
      loadTopInlineBots();
      loadEmojiKeywords({ language: BASE_EMOJI_KEYWORD_LANG });
      loadAttachBots();
      loadContactList();
      loadPremiumGifts();
      loadDefaultTopicIcons();
      checkAppVersion();
      loadTopReactions();
      loadRecentReactions();
      loadFeaturedEmojiStickers();
    }
  }, [
    lastSyncTime,
    loadAnimatedEmojis,
    loadEmojiKeywords,
    loadNotificationExceptions,
    loadNotificationSettings,
    loadTopInlineBots,
    updateIsOnline,
    loadAvailableReactions,
    loadAppConfig,
    loadAttachBots,
    loadContactList,
    loadPremiumGifts,
    checkAppVersion,
    loadConfig,
    loadGenericEmojiEffects,
    loadDefaultTopicIcons,
    loadTopReactions,
    loadDefaultStatusIcons,
    loadRecentReactions,
    loadRecentEmojiStatuses,
    isCurrentUserPremium,
    isMasterTab,
    initMain,
  ]);

  // Initial Premium API calls
  useEffect(() => {
    if (lastSyncTime && isMasterTab && isCurrentUserPremium) {
      loadDefaultStatusIcons();
      loadRecentEmojiStatuses();
    }
  }, [
    isCurrentUserPremium,
    isMasterTab,
    lastSyncTime,
    loadDefaultStatusIcons,
    loadRecentEmojiStatuses,
  ]);

  // Language-based API calls
  useEffect(() => {
    if (lastSyncTime && isMasterTab) {
      if (language !== BASE_EMOJI_KEYWORD_LANG) {
        loadEmojiKeywords({ language: language! });
      }

      loadCountryList({ langCode: language });
    }
  }, [language, lastSyncTime, loadCountryList, loadEmojiKeywords, isMasterTab]);

  // Re-fetch cached saved emoji for `localDb`
  useEffectWithPrevDeps(
    ([prevLastSyncTime]) => {
      if (!prevLastSyncTime && lastSyncTime && isMasterTab) {
        loadCustomEmojis({
          ids: Object.keys(getGlobal().customEmojis.byId),
          ignoreCache: true,
        });
      }
    },
    [lastSyncTime, isMasterTab, loadCustomEmojis]
  );

  // Sticker sets
  useEffect(() => {
    if (lastSyncTime && isMasterTab) {
      if (!addedSetIds || !addedCustomEmojiIds) {
        loadStickerSets();
        loadFavoriteStickers();
      }

      if (addedSetIds && addedCustomEmojiIds) {
        loadAddedStickers();
      }
    }
  }, [
    lastSyncTime,
    addedSetIds,
    loadStickerSets,
    loadFavoriteStickers,
    loadAddedStickers,
    addedCustomEmojiIds,
    isMasterTab,
  ]);

  // Check version when service chat is ready
  useEffect(() => {
    if (lastSyncTime && isServiceChatReady && isMasterTab) {
      checkVersionNotification();
    }
  }, [lastSyncTime, isServiceChatReady, checkVersionNotification, isMasterTab]);

  // Ensure time format
  useEffect(() => {
    if (lastSyncTime && !wasTimeFormatSetManually) {
      ensureTimeFormat();
    }
  }, [lastSyncTime, wasTimeFormatSetManually, ensureTimeFormat]);

  // Parse deep link
  useEffect(() => {
    const parsedInitialLocationHash = parseInitialLocationHash();
    if (lastSyncTime && parsedInitialLocationHash?.tgaddr) {
      processDeepLink(decodeURIComponent(parsedInitialLocationHash.tgaddr));
    }
  }, [lastSyncTime]);

  useEffectWithPrevDeps(
    ([prevLastSyncTime]) => {
      const parsedLocationHash = parseLocationHash();
      if (!parsedLocationHash) return;

      if (!prevLastSyncTime && lastSyncTime) {
        openChat({
          id: parsedLocationHash.chatId,
          threadId: parsedLocationHash.threadId,
          type: parsedLocationHash.type,
        });
      }
    },
    [lastSyncTime, openChat]
  );

  // Restore Transition slide class after async rendering
  useLayoutEffect(() => {
    const container = containerRef.current!;
    if (container.parentNode!.childElementCount === 1) {
      addExtraClass(container, "Transition_slide-active");
    }
  }, []);

  const leftColumnTransition = useShowTransition(
    isLeftColumnOpen,
    undefined,
    true,
    undefined,
    shouldSkipHistoryAnimations,
    undefined,
    true
  );
  const willAnimateLeftColumnRef = useRef(false);
  const forceUpdate = useForceUpdate();

  // Handle opening middle column
  useSyncEffect(
    ([prevIsLeftColumnOpen]) => {
      if (
        prevIsLeftColumnOpen === undefined ||
        isLeftColumnOpen === prevIsLeftColumnOpen ||
        !withInterfaceAnimations
      ) {
        return;
      }

      willAnimateLeftColumnRef.current = true;

      if (IS_ANDROID) {
        requestNextMutation(() => {
          document.body.classList.toggle(
            "android-left-blackout-open",
            !isLeftColumnOpen
          );
        });
      }

      const dispatchHeavyAnimationEnd = dispatchHeavyAnimationEvent();

      waitForTransitionEnd(document.getElementById("MiddleColumn")!, () => {
        dispatchHeavyAnimationEnd();
        willAnimateLeftColumnRef.current = false;
        forceUpdate();
      });
    },
    [isLeftColumnOpen, withInterfaceAnimations, forceUpdate]
  );

  const rightColumnTransition = useShowTransition(
    isRightColumnOpen,
    undefined,
    true,
    undefined,
    shouldSkipHistoryAnimations,
    undefined,
    true
  );
  const willAnimateRightColumnRef = useRef(false);
  const [isNarrowMessageList, setIsNarrowMessageList] =
    useState(isRightColumnOpen);

  // Handle opening right column
  useSyncEffect(
    ([prevIsRightColumnOpen]) => {
      if (
        prevIsRightColumnOpen === undefined ||
        isRightColumnOpen === prevIsRightColumnOpen
      ) {
        return;
      }

      if (noRightColumnAnimation) {
        setIsNarrowMessageList(isRightColumnOpen);
        return;
      }

      willAnimateRightColumnRef.current = true;

      const dispatchHeavyAnimationEnd = dispatchHeavyAnimationEvent();

      waitForTransitionEnd(document.getElementById("RightColumn")!, () => {
        dispatchHeavyAnimationEnd();
        willAnimateRightColumnRef.current = false;
        forceUpdate();
        setIsNarrowMessageList(isRightColumnOpen);
      });
    },
    [isRightColumnOpen, noRightColumnAnimation, forceUpdate]
  );

  const className = clsx(
    leftColumnTransition.hasShownClass && "left-column-shown",
    leftColumnTransition.hasOpenClass && "left-column-open",
    willAnimateLeftColumnRef.current && "left-column-animating",
    rightColumnTransition.hasShownClass && "right-column-shown",
    rightColumnTransition.hasOpenClass && "right-column-open",
    willAnimateRightColumnRef.current && "right-column-animating",
    isNarrowMessageList && "narrow-message-list",
    shouldSkipHistoryAnimations && "history-animation-disabled"
  );

  const handleBlur = useCallback(() => {
    onTabFocusChange({ isBlurred: true });
  }, [onTabFocusChange]);

  const handleFocus = useCallback(() => {
    onTabFocusChange({ isBlurred: false });

    if (!document.title.includes(INACTIVE_MARKER)) {
      updatePageTitle();
    }

    updateIcon(false);
  }, [onTabFocusChange, updatePageTitle]);

  const handleStickerSetModalClose = useCallback(() => {
    closeStickerSetModal();
  }, [closeStickerSetModal]);

  const handleCustomEmojiSetsModalClose = useCallback(() => {
    closeCustomEmojiSets();
  }, [closeCustomEmojiSets]);

  // Online status and browser tab indicators
  useBackgroundMode(handleBlur, handleFocus);
  useBeforeUnload(handleBlur);
  usePreventPinchZoomGesture(isMediaViewerOpen);

  return (
    <div ref={containerRef} id="Main" className={className}>
      <LeftColumn />
      <MiddleColumn isMobile={isMobile} />
      <RightColumn isMobile={isMobile} />
      <MediaViewer isOpen={isMediaViewerOpen} />
      <ForwardRecipientPicker isOpen={isForwardModalOpen} />
      <DraftRecipientPicker requestedDraft={requestedDraft} />
      <Notifications isOpen={hasNotifications} />
      <Dialogs isOpen={hasDialogs} />
      {audioMessage && (
        <AudioPlayer key={audioMessage.id} message={audioMessage} noUi />
      )}
      <SafeLinkModal url={safeLinkModalUrl} />
      <UrlAuthModal urlAuth={urlAuth} currentUser={currentUser} />
      <HistoryCalendar isOpen={isHistoryCalendarOpen} />
      <StickerSetModal
        isOpen={Boolean(openedStickerSetShortName)}
        onClose={handleStickerSetModalClose}
        stickerSetShortName={openedStickerSetShortName}
      />
      <CustomEmojiSetsModal
        customEmojiSetIds={openedCustomEmojiSetIds}
        onClose={handleCustomEmojiSetsModalClose}
      />
      {activeGroupCallId && <GroupCall groupCallId={activeGroupCallId} />}
      <ActiveCallHeader
        isActive={Boolean(activeGroupCallId || isPhoneCallActive)}
      />
      <NewContactModal
        isOpen={Boolean(newContactUserId || newContactByPhoneNumber)}
        userId={newContactUserId}
        isByPhoneNumber={newContactByPhoneNumber}
      />
      <ChatlistModal info={chatlistModal} />
      <GameModal openedGame={openedGame} gameTitle={gameTitle} />
      <WebAppModal webApp={webApp} />
      <DownloadManager />
      <ConfettiContainer />
      <PhoneCall isActive={isPhoneCallActive} />
      <UnreadCount isForAppBadge />
      <RatePhoneCallModal isOpen={isRatePhoneCallModalOpen} />
      <BotTrustModal
        bot={botTrustRequestBot}
        type={botTrustRequest?.type}
        shouldRequestWriteAccess={botTrustRequest?.shouldRequestWriteAccess}
      />
      <AttachBotInstallModal bot={attachBotToInstall} />
      <AttachBotRecipientPicker
        requestedAttachBotInChat={requestedAttachBotInChat}
      />
      <MessageListHistoryHandler />
      {isPremiumModalOpen && <PremiumMainModal isOpen={isPremiumModalOpen} />}
      <PremiumLimitReachedModal limit={limitReached} />
      <PaymentModal isOpen={isPaymentModalOpen} onClose={closePaymentModal} />
      <ReceiptModal isOpen={isReceiptModalOpen} onClose={clearReceipt} />
      <DeleteFolderDialog folder={deleteFolderDialog} />
      <ReactionPicker
        isOpen={isReactionPickerOpen}
        shouldLoad={shouldLoadReactionPicker}
      />
    </div>
  );
};

export default memo(Main);
