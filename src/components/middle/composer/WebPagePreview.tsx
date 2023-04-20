import type { Signal } from "../../../util/signals";
import type { FC } from "react";
import { memo, useCallback, useEffect } from "react";

import type {
  ApiMessage,
  ApiMessageEntityTextUrl,
  ApiWebPage,
} from "../../../api/types";
import { ApiMessageEntityTypes } from "../../../api/types";
import type { ISettings } from "../../../types";

import { RE_LINK_TEMPLATE } from "../../../config";
import clsx from "clsx";
import parseMessageInput from "../../../util/parseMessageInput";
import useSyncEffect from "../../../hooks/useSyncEffect";
import useShowTransition from "../../../hooks/useShowTransition";
import useCurrentOrPrev from "../../../hooks/useCurrentOrPrev";
import useDerivedState from "../../../hooks/useDerivedState";
import useDerivedSignal from "../../../hooks/useDerivedSignal";
import { useDebouncedResolver } from "../../../hooks/useAsyncResolvers";

import WebPage from "../message/WebPage";
import Button from "../../ui/Button";

import "./WebPagePreview.scss";
import {
  loadWebPagePreview,
  clearWebPagePreview,
  toggleMessageWebPage,
} from "../../../global/actions";
import { useAtomValue } from "jotai";
import { noWebPageAtom, themeAtom, webPagePreviewAtom } from "../../../global";

type OwnProps = {
  chatId: string;
  threadId: number;
  getHtml: Signal<string>;
  isDisabled?: boolean;
};

type StateProps = {
  webPagePreview?: ApiWebPage;
  noWebPage?: boolean;
  theme: ISettings["theme"];
};

const DEBOUNCE_MS = 300;
const RE_LINK = new RegExp(RE_LINK_TEMPLATE, "i");

const WebPagePreview: FC<OwnProps> = ({
  chatId,
  threadId,
  getHtml,
  isDisabled,
}) => {
  const theme = useAtomValue(themeAtom);
  const webPagePreview = useAtomValue(webPagePreviewAtom)
  const noWebPage = useAtomValue(noWebPageAtom)
  const detectLinkDebounced = useDebouncedResolver(
    () => {
      const { text, entities } = parseMessageInput(getHtml());
      const linkEntity = entities?.find(
        (entity): entity is ApiMessageEntityTextUrl =>
          entity.type === ApiMessageEntityTypes.TextUrl
      );

      return linkEntity?.url || text.match(RE_LINK)?.[0];
    },
    [getHtml],
    DEBOUNCE_MS,
    true
  );

  const getLink = useDerivedSignal(
    detectLinkDebounced,
    [detectLinkDebounced, getHtml],
    true
  );

  useEffect(() => {
    const link = getLink();

    if (link) {
      loadWebPagePreview({ text: link });
    } else {
      clearWebPagePreview();
      toggleMessageWebPage({ chatId, threadId });
    }
  }, [
    getLink,
    chatId,
    threadId,
    clearWebPagePreview,
    loadWebPagePreview,
    toggleMessageWebPage,
  ]);

  useSyncEffect(() => {
    clearWebPagePreview();
    toggleMessageWebPage({ chatId, threadId });
  }, [chatId, clearWebPagePreview, threadId, toggleMessageWebPage]);

  const isShown = useDerivedState(() => {
    return Boolean(webPagePreview && getHtml() && !noWebPage && !isDisabled);
  }, [isDisabled, getHtml, noWebPage, webPagePreview]);
  const { shouldRender, transitionClassNames } = useShowTransition(isShown);

  const renderingWebPage = useCurrentOrPrev(webPagePreview, true);

  const handleClearWebpagePreview = useCallback(() => {
    toggleMessageWebPage({ chatId, threadId, noWebPage: true });
  }, [chatId, threadId, toggleMessageWebPage]);

  if (!shouldRender || !renderingWebPage) {
    return null;
  }

  // TODO Refactor so `WebPage` can be used without message
  const { photo, ...webPageWithoutPhoto } = renderingWebPage;
  const messageStub = {
    content: {
      webPage: webPageWithoutPhoto,
    },
  } as ApiMessage;

  return (
    <div className={clsx("WebPagePreview", transitionClassNames)}>
      <div>
        <div className="WebPagePreview-left-icon">
          <i className="icon-link" />
        </div>
        <WebPage message={messageStub} inPreview theme={theme} />
        <Button
          className="WebPagePreview-clear"
          round
          faded
          color="translucent"
          ariaLabel="Clear Webpage Preview"
          onClick={handleClearWebpagePreview}
        >
          <i className="icon-close" />
        </Button>
      </div>
    </div>
  );
};

export default memo(WebPagePreview);
