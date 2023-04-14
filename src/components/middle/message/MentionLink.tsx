import React, { FC } from "react";
import type { ApiChat, ApiUser } from "../../../api/types";
import { ApiMessageEntityTypes } from "../../../api/types";
import { openChat, openChatByUsername } from "../../../global/actions";

type OwnProps = {
  userId?: string;
  username?: string;
  children: React.ReactNode;
};

type StateProps = {
  userOrChat?: ApiUser | ApiChat;
};

const MentionLink: FC<OwnProps & StateProps> = ({
  userId,
  username,
  userOrChat,
  children,
}) => {
  const handleClick = () => {
    if (userOrChat) {
      openChat({ id: userOrChat.id });
    } else if (username) {
      openChatByUsername({ username: username.substring(1) });
    }
  };

  return (
    <a
      onClick={handleClick}
      className="text-entity-link"
      dir="auto"
      data-entity-type={
        userId
          ? ApiMessageEntityTypes.MentionName
          : ApiMessageEntityTypes.Mention
      }
    >
      {children}
    </a>
  );
};

export default MentionLink;
