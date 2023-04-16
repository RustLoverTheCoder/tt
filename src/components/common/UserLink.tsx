import type { FC } from "react";
import React, { useCallback } from "react";

import type { ApiChat, ApiUser } from "../../api/types";

import clsx from "clsx";
import Link from "../ui/Link";
import { openChat } from "../../global/actions";

type OwnProps = {
  className?: string;
  sender?: ApiUser | ApiChat;
  children: React.ReactNode;
};

const UserLink: FC<OwnProps> = ({ className, sender, children }) => {
  const handleClick = useCallback(() => {
    if (sender) {
      openChat({ id: sender.id });
    }
  }, [sender, openChat]);

  if (!sender) {
    return <>{children}</>;
  }

  return (
    <Link className={clsx("UserLink", className)} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default UserLink;
