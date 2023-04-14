import { useEffect } from "react";
import UiLoader, { UiLoaderPage } from "./components/common/UiLoader";
import useAppLayout from "./hooks/useAppLayout";
import Transition from "./components/ui/Transition";
import clsx from "clsx";
import useFlag from "./hooks/useFlag";
import { PLATFORM_ENV } from "./util/windowEnvironment";
import { useAtom } from "jotai";
import {
  authStateAtom,
  hasWebAuthTokenFailedAtom,
  hasWebAuthTokenPasswordRequiredAtom,
  passcodeAtom,
} from "./global";
import { hasStoredSession } from "./util/sessions";
import { parseInitialLocationHash } from "./util/routing";
import usePrevious from "./hooks/usePrevious";
import Auth from "./components/auth/Auth";
import Main from "./components/main/Main";
import LockScreen from "./components/main/LockScreen";
import AppInactive from "./components/main/AppInactive";

enum AppScreens {
  auth,
  lock,
  main,
  inactive,
}

function App() {
  // todo isInactiveAuth
  const [isInactive, markInactive, unmarkInactive] = useFlag(false);
  const { isMobile } = useAppLayout();
  const isMobileOs = PLATFORM_ENV === "iOS" || PLATFORM_ENV === "Android";

  useEffect(() => {
    const body = document.body;
    const handleDrag = (e: DragEvent) => {
      e.preventDefault();
      if (!e.dataTransfer) return;
      if (!(e.target as HTMLElement).dataset.dropzone) {
        e.dataTransfer.dropEffect = "none";
      } else {
        e.dataTransfer.dropEffect = "copy";
      }
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
    };
    body.addEventListener("drop", handleDrop);
    body.addEventListener("dragover", handleDrag);
    body.addEventListener("dragenter", handleDrag);

    return () => {
      body.removeEventListener("drop", handleDrop);
      body.removeEventListener("dragover", handleDrag);
      body.removeEventListener("dragenter", handleDrag);
    };
  }, []);

  let activeKey: number;
  let page: UiLoaderPage = "main";
  const [authState] = useAtom(authStateAtom);
  const [hasWebAuthTokenFailedState] = useAtom(hasWebAuthTokenFailedAtom);
  const [hasWebAuthTokenPasswordRequired] = useAtom(
    hasWebAuthTokenPasswordRequiredAtom
  );
  const hasWebAuthTokenFailed =
    hasWebAuthTokenFailedState || hasWebAuthTokenPasswordRequired;
  const [passcode] = useAtom(passcodeAtom);
  const isScreenLocked = passcode?.isScreenLocked;
  const hasPasscode = passcode?.hasPasscode;

  if (isInactive) {
    activeKey = AppScreens.inactive;
  } else if (isScreenLocked) {
    page = "lock";
    activeKey = AppScreens.lock;
  } else if (authState) {
    switch (authState) {
      case "authorizationStateWaitPhoneNumber":
        page = "authPhoneNumber";
        activeKey = AppScreens.auth;
        break;
      case "authorizationStateWaitCode":
        page = "authCode";
        activeKey = AppScreens.auth;
        break;
      case "authorizationStateWaitPassword":
        page = "authPassword";
        activeKey = AppScreens.auth;
        break;
      case "authorizationStateWaitRegistration":
        activeKey = AppScreens.auth;
        break;
      case "authorizationStateWaitQrCode":
        page = "authQrCode";
        activeKey = AppScreens.auth;
        break;
      case "authorizationStateClosed":
      case "authorizationStateClosing":
      case "authorizationStateLoggingOut":
      case "authorizationStateReady":
        page = "main";
        activeKey = AppScreens.main;
        break;
    }
  } else if (hasStoredSession(true)) {
    page = "main";
    activeKey = AppScreens.main;
  } else if (hasPasscode) {
    activeKey = AppScreens.lock;
  } else {
    page = isMobileOs ? "authPhoneNumber" : "authQrCode";
    activeKey = AppScreens.auth;
  }

  if (
    activeKey !== AppScreens.lock &&
    activeKey !== AppScreens.inactive &&
    activeKey !== AppScreens.main &&
    parseInitialLocationHash()?.tgWebAuthToken &&
    !hasWebAuthTokenFailed
  ) {
    page = "main";
    activeKey = AppScreens.main;
  }

  const prevActiveKey = usePrevious(activeKey);

  function renderContent() {
    switch (activeKey) {
      case AppScreens.auth:
        return <Auth />;
      case AppScreens.main:
        return <Main isMobile={isMobile} />;
      case AppScreens.lock:
        return <LockScreen isLocked={isScreenLocked} />;
      case AppScreens.inactive:
        return <AppInactive />;
    }
  }

  return (
    <UiLoader key="Loader" page={page} isMobile={isMobile}>
      <Transition
        name="fade"
        activeKey={activeKey}
        shouldCleanup
        className={clsx(
          "full-height",
          (activeKey === AppScreens.auth ||
            prevActiveKey === AppScreens.auth) &&
            "is-auth"
        )}
      >
        {renderContent}
      </Transition>
    </UiLoader>
  );
}

export default App;
