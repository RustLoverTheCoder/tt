import { useAtom } from "jotai";
import { memo } from "react";
import { authStateAtom } from "../../global";
import { goToAuthQrCode, returnToAuthPhoneNumber } from "../../global/actions";
import useCurrentOrPrev from "../../hooks/useCurrentOrPrev";
import useHistoryBack from "../../hooks/useHistoryBack";
import { PLATFORM_ENV } from "../../util/windowEnvironment";
import Transition from "../ui/Transition";

import "./Auth.css";
import AuthCode from "./AuthCode";
import AuthPassword from "./AuthPassword";
import AuthPhoneNumber from "./AuthPhoneNumber";
import AuthQrCode from "./AuthQrCode";
import AuthRegister from "./AuthRegister";

const Auth = () => {
  const [authState] = useAtom(authStateAtom);
  const isMobile = PLATFORM_ENV === "iOS" || PLATFORM_ENV === "Android";
  const handleChangeAuthorizationMethod = () => {
    if (!isMobile) {
      goToAuthQrCode();
    } else {
      returnToAuthPhoneNumber();
    }
  };

  useHistoryBack({
    isActive:
      (!isMobile && authState === "authorizationStateWaitPhoneNumber") ||
      (isMobile && authState === "authorizationStateWaitQrCode"),
    onBack: handleChangeAuthorizationMethod,
  });
  // For animation purposes
  const renderingAuthState = useCurrentOrPrev(
    authState !== "authorizationStateReady" ? authState : undefined,
    true
  );
  function getScreen() {
    switch (renderingAuthState) {
      case "authorizationStateWaitCode":
        return <AuthCode />;
      case "authorizationStateWaitPassword":
        return <AuthPassword />;
      case "authorizationStateWaitRegistration":
        return <AuthRegister />;
      case "authorizationStateWaitPhoneNumber":
        return <AuthPhoneNumber />;
      case "authorizationStateWaitQrCode":
        return <AuthQrCode />;
      default:
        return isMobile ? <AuthPhoneNumber /> : <AuthQrCode />;
    }
  }

  function getActiveKey() {
    switch (renderingAuthState) {
      case "authorizationStateWaitCode":
        return 0;
      case "authorizationStateWaitPassword":
        return 1;
      case "authorizationStateWaitRegistration":
        return 2;
      case "authorizationStateWaitPhoneNumber":
        return 3;
      case "authorizationStateWaitQrCode":
        return 4;
      default:
        return isMobile ? 3 : 4;
    }
  }
  return (
    <Transition activeKey={getActiveKey()} name="fade" className="Auth">
      {getScreen()}
    </Transition>
  );
};

export default memo(Auth);
