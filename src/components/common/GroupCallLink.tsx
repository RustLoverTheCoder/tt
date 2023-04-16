import type { FC } from "react";
import React, { useCallback } from "react";

import type { ApiGroupCall } from "../../api/types";

import clsx from "clsx";

import Link from "../ui/Link";
import { requestMasterAndJoinGroupCall } from "../../global/actions";

type OwnProps = {
  className?: string;
  groupCall?: Partial<ApiGroupCall>;
  children: React.ReactNode;
};

const GroupCallLink: FC<OwnProps> = ({ className, groupCall, children }) => {
  const handleClick = useCallback(() => {
    if (groupCall) {
      requestMasterAndJoinGroupCall({
        id: groupCall.id,
        accessHash: groupCall.accessHash,
      });
    }
  }, [groupCall, requestMasterAndJoinGroupCall]);

  if (!groupCall) {
    return <>{children}</>;
  }

  return (
    <Link className={clsx("GroupCallLink", className)} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default GroupCallLink;
