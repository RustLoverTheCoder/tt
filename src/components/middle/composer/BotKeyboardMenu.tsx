
import type { FC } from "react";
import { memo } from "react";

import { IS_TOUCH_ENV } from "../../../util/windowEnvironment";
import useMouseInside from "../../../hooks/useMouseInside";

import Menu from "../../ui/Menu";
import Button from "../../ui/Button";

import "./BotKeyboardMenu.scss";
import { useAtom } from "jotai";
import { clickBotInlineButton } from "../../../global/actions";
import { currentMessageAtom } from "../../../global";

export type OwnProps = {
  isOpen: boolean;
  messageId: number;
  onClose: NoneToVoidFunction;
};

const BotKeyboardMenu: FC<OwnProps> = ({ isOpen, onClose }) => {
  const [message] = useAtom(currentMessageAtom);
  const [handleMouseEnter, handleMouseLeave] = useMouseInside(isOpen, onClose);
  const { isKeyboardSingleUse } = message || {};

  if (!message || !message.keyboardButtons) {
    return null;
  }

  return (
    <Menu
      isOpen={isOpen}
      autoClose={isKeyboardSingleUse}
      positionX="right"
      positionY="bottom"
      onClose={onClose}
      className="BotKeyboardMenu"
      onCloseAnimationEnd={onClose}
      onMouseEnter={!IS_TOUCH_ENV ? handleMouseEnter : undefined}
      onMouseLeave={!IS_TOUCH_ENV ? handleMouseLeave : undefined}
      noCompact
    >
      <div className="content">
        {message.keyboardButtons.map((row) => (
          <div className="row">
            {row.map((button) => (
              <Button
                ripple
                disabled={button.type === "unsupported"}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() =>
                  clickBotInlineButton({ messageId: message.id, button })
                }
              >
                {button.text}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </Menu>
  );
};

export default memo(BotKeyboardMenu);
