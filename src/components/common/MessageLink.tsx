import type { FC } from "react";
import React, { useCallback } from "react";

import type { ApiMessage } from "../../api/types";

import clsx from "clsx";

import Link from "../ui/Link";
import { focusMessage } from "../../global/actions";

type OwnProps = {
  className?: string;
  message?: ApiMessage;
  children: React.ReactNode;
};

const MessageLink: FC<OwnProps> = ({ className, message, children }) => {
  const handleMessageClick = useCallback((): void => {
    if (message) {
      focusMessage({ chatId: message.chatId, messageId: message.id });
    }
  }, [focusMessage, message]);

  if (!message) {
    return <>{children}</>;
  }

  return (
    <Link
      className={clsx("MessageLink", className)}
      onClick={handleMessageClick}
    >
      {children}
    </Link>
  );
};

export default MessageLink;
