import type { FC } from "react";
import { memo } from "react";
import type { OwnProps } from "./BotCommandTooltip";
import { Bundles } from "../../../util/moduleLoader";

import useModuleLoader from "../../../hooks/useModuleLoader";

const BotCommandTooltipAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const BotCommandTooltip = useModuleLoader(
    Bundles.Extra,
    "BotCommandTooltip",
    !isOpen
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return BotCommandTooltip ? <BotCommandTooltip {...props} /> : null;
};

export default memo(BotCommandTooltipAsync);
