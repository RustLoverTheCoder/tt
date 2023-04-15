import { useEffect, useRef, memo, useCallback, FC } from "react";
import {
  authQrCodeAtom,
  authStateAtom,
  connectionStateAtom,
  languageAtom,
} from "../../global";
import { DEFAULT_LANG_CODE } from "../../config";
import { LOCAL_TGS_URLS } from "../common/helpers/animatedAssets";
import { setLanguage } from "../../util/langProvider";
import clsx from "clsx";
import renderText from "../common/helpers/renderText";
import { getSuggestedLanguage } from "./helpers/getSuggestedLanguage";

import useLangString from "../../hooks/useLangString";
import useFlag from "../../hooks/useFlag";
import useLang from "../../hooks/useLang";
import useMediaTransition from "../../hooks/useMediaTransition";
import useAsync from "../../hooks/useAsync";

import Loading from "../ui/Loading";
import Button from "../ui/Button";
import AnimatedIcon from "../common/AnimatedIcon";

import blankUrl from "../../assets/blank.png";
import { useAtom } from "jotai";
import {
  returnToAuthPhoneNumber,
  setSettingOption,
} from "../../global/actions";

const DATA_PREFIX = "tg://login?token=";
const QR_SIZE = 280;
const QR_PLANE_SIZE = 54;

let qrCodeStylingPromise: Promise<typeof import("qr-code-styling")>;

function ensureQrCodeStyling() {
  if (!qrCodeStylingPromise) {
    qrCodeStylingPromise = import("qr-code-styling");
  }
  return qrCodeStylingPromise;
}

const AuthQrCode = () => {
  const [connectionState] = useAtom(connectionStateAtom);
  const [authState] = useAtom(authStateAtom);
  const [authQrCode] = useAtom(authQrCodeAtom);
  const [language] = useAtom(languageAtom);

  const suggestedLanguage = getSuggestedLanguage();
  const lang = useLang();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const continueText = useLangString(
    suggestedLanguage,
    "ContinueOnThisLanguage",
    true
  );
  const [isLoading, markIsLoading, unmarkIsLoading] = useFlag(true);
  const [isQrMounted, markQrMounted, unmarkQrMounted] = useFlag(false);

  const { result: qrCode } = useAsync(async () => {
    const QrCodeStyling = (await ensureQrCodeStyling()).default;
    return new QrCodeStyling({
      width: QR_SIZE,
      height: QR_SIZE,
      image: blankUrl,
      margin: 10,
      type: "svg",
      dotsOptions: {
        type: "rounded",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
      },
      imageOptions: {
        imageSize: 0.4,
        margin: 8,
      },
      qrOptions: {
        errorCorrectionLevel: "M",
      },
    });
  }, []);
  const transitionClassNames = useMediaTransition(isQrMounted);
  useEffect(() => {
    if (!authQrCode || !qrCode) {
      return () => {
        unmarkQrMounted();
      };
    }

    if (connectionState !== "connectionStateReady") {
      return undefined;
    }

    const container = qrCodeRef.current!;
    const data = `${DATA_PREFIX}${authQrCode.token}`;

    qrCode.update({
      data,
    });

    if (!isQrMounted) {
      qrCode.append(container);
      markQrMounted();
    }
    return undefined;
  }, [
    connectionState,
    authQrCode,
    isQrMounted,
    markQrMounted,
    unmarkQrMounted,
    qrCode,
  ]);

  useEffect(() => {
    if (connectionState === "connectionStateReady") {
      void setLanguage(DEFAULT_LANG_CODE);
    }
  }, [connectionState]);

  const handleLangChange = useCallback(() => {
    markIsLoading();

    void setLanguage(suggestedLanguage, () => {
      unmarkIsLoading();

      setSettingOption({ language: suggestedLanguage });
    });
  }, [markIsLoading, setSettingOption, suggestedLanguage, unmarkIsLoading]);

  const habdleReturnToAuthPhoneNumber = useCallback(() => {
    returnToAuthPhoneNumber();
  }, [returnToAuthPhoneNumber]);

  const isAuthReady = authState === "authorizationStateWaitQrCode";
  return (
    <div id="auth-qr-form" className="custom-scroll">
      <div className="auth-form qr">
        <div className="qr-outer">
          <div
            className={clsx("qr-inner", transitionClassNames)}
            key="qr-inner"
          >
            <div
              key="qr-container"
              className="qr-container"
              ref={qrCodeRef}
              style={{ width: QR_SIZE, height: QR_SIZE }}
            />
            {/* <AnimatedIcon
              tgsUrl={LOCAL_TGS_URLS.QrPlane}
              size={QR_PLANE_SIZE}
              className="qr-plane"
              nonInteractive
              noLoop={false}
            /> */}
          </div>
          {!isQrMounted && (
            <div className="qr-loading">
              <Loading />
            </div>
          )}
        </div>
        <h1>{lang("Login.QR.Title")}</h1>
        <ol>
          <li>
            <span>{lang("Login.QR.Help1")}</span>
          </li>
          <li>
            <span>
              {renderText(lang("Login.QR2.Help2"), ["simple_markdown"])}
            </span>
          </li>
          <li>
            <span>{lang("Login.QR.Help3")}</span>
          </li>
        </ol>
        {isAuthReady && (
          <Button isText onClick={habdleReturnToAuthPhoneNumber}>
            {lang("Login.QR.Cancel")}
          </Button>
        )}
        {suggestedLanguage &&
          suggestedLanguage !== language &&
          continueText && (
            <Button isText isLoading={isLoading} onClick={handleLangChange}>
              {continueText}
            </Button>
          )}
      </div>
    </div>
  );
};
export default memo(AuthQrCode);
