import React, { memo, useCallback } from "react";
import type { FC } from "react";

import clsx from "clsx";
import Link from "../ui/Link";
import { openChat } from "../../global/actions";

type OwnProps = {
  className?: string;
  chatId?: string;
  children: React.ReactNode;
};

const ChatLink: FC<OwnProps> = ({ className, chatId, children }) => {
  const handleClick = useCallback(() => {
    if (chatId) {
      openChat({ id: chatId });
    }
  }, [chatId, openChat]);

  if (!chatId) {
    return <>{children}</>;
  }

  return (
    <Link className={clsx("ChatLink", className)} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default memo(ChatLink);
