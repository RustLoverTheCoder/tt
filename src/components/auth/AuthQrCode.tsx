import { useAtom } from "jotai";
import {
  memo,
  FormEvent,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  authErrorAtom,
  authIsCodeViaAppAtom,
  authIsLoadingAtom,
  authPhoneNumberAtom,
  authQrCodeAtom,
  authStateAtom,
  connectionStateAtom,
  languageAtom,
} from "../../global";
import { IS_TOUCH_ENV } from "../../util/windowEnvironment";
import renderText from "../common/helpers/renderText";
import useLang from "../../hooks/useLang";
import { getSuggestedLanguage } from "./helpers/getSuggestedLanguage";
import useHistoryBack from "../../hooks/useHistoryBack";
import {
  clearAuthError,
  returnToAuthPhoneNumber,
  setAuthCode,
} from "../../global/actions";
import TrackingMonkey from "../common/TrackingMonkey";
import InputText from "../ui/InputText";
import Loading from "../ui/Loading";

const CODE_LENGTH = 5;

const AuthQrCode = () => {
  const [connectionState] = useAtom(connectionStateAtom);
  const [authState] = useAtom(authStateAtom);
  const [authQrCode] = useAtom(authQrCodeAtom);
  const [language] = useAtom(languageAtom);
  const [authError] = useAtom(authErrorAtom);
  const [authPhoneNumber] = useAtom(authPhoneNumberAtom);
  const [authIsCodeViaApp] = useAtom(authIsCodeViaAppAtom);
  const [authIsLoading] = useAtom(authIsLoadingAtom);

  const suggestedLanguage = getSuggestedLanguage();
  const lang = useLang();

  const inputRef = useRef<HTMLInputElement>(null);

  const [code, setCode] = useState<string>("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingDirection, setTrackingDirection] = useState(1);

  useEffect(() => {
    if (!IS_TOUCH_ENV) {
      inputRef.current!.focus();
    }
  }, []);

  useHistoryBack({
    isActive: true,
    onBack: returnToAuthPhoneNumber,
  });

  const onCodeChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      if (authError) {
        clearAuthError();
      }

      const { currentTarget: target } = e;
      target.value = target.value.replace(/[^\d]+/, "").substr(0, CODE_LENGTH);

      if (target.value === code) {
        return;
      }

      setCode(target.value);

      if (!isTracking) {
        setIsTracking(true);
      } else if (!target.value.length) {
        setIsTracking(false);
      }

      if (code && code.length > target.value.length) {
        setTrackingDirection(-1);
      } else {
        setTrackingDirection(1);
      }

      if (target.value.length === CODE_LENGTH) {
        setAuthCode({ code: target.value });
      }
    },
    [authError, clearAuthError, code, isTracking, setAuthCode]
  );

  function handleReturnToAuthPhoneNumber() {
    returnToAuthPhoneNumber();
  }

  return (
    <div id="auth-code-form" className="custom-scroll">
      <div className="auth-form">
        <TrackingMonkey
          code={code}
          codeLength={CODE_LENGTH}
          isTracking={isTracking}
          trackingDirection={trackingDirection}
        />
        <h1>
          {authPhoneNumber}
          <div
            className="auth-number-edit"
            onClick={handleReturnToAuthPhoneNumber}
            role="button"
            tabIndex={0}
            title={lang("WrongNumber")}
          >
            <i className="icon-edit" />
          </div>
        </h1>
        <p className="note">
          {renderText(
            lang(authIsCodeViaApp ? "SentAppCode" : "Login.JustSentSms"),
            ["simple_markdown"]
          )}
        </p>
        <InputText
          ref={inputRef}
          id="sign-in-code"
          label={lang("Code")}
          onInput={onCodeChange}
          value={code}
          error={authError && lang(authError)}
          autoComplete="off"
          inputMode="numeric"
        />
        {authIsLoading && <Loading />}
      </div>
    </div>
  );
};
export default memo(AuthQrCode);
