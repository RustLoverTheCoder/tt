import { memo, useCallback, useState } from "react";

import type { OwnProps as AnimatedStickerProps } from "./AnimatedSticker";

import clsx from "clsx";
import useMediaTransition from "../../hooks/useMediaTransition";
import useFlag from "../../hooks/useFlag";

import AnimatedSticker from "./AnimatedSticker";

const DEFAULT_SIZE = 150;

export type OwnProps = Partial<AnimatedStickerProps> & {
  noTransition?: boolean;
  nonInteractive?: boolean;
};

function AnimatedIcon(props: OwnProps) {
  const {
    size = DEFAULT_SIZE,
    play = true,
    noLoop = true,
    className,
    noTransition,
    nonInteractive,
    onLoad,
    onClick,
    ...otherProps
  } = props;
  const [isAnimationLoaded, markAnimationLoaded] = useFlag(false);
  const transitionClassNames = useMediaTransition(
    noTransition || isAnimationLoaded
  );

  const handleLoad = useCallback(() => {
    markAnimationLoaded();
    onLoad?.();
  }, [markAnimationLoaded, onLoad]);

  const [playKey, setPlayKey] = useState(String(Math.random()));

  const handleClick = useCallback(() => {
    if (play === true) {
      setPlayKey(String(Math.random()));
    }

    onClick?.();
  }, [onClick, play]);

  return (
    <AnimatedSticker
      className={clsx(className, transitionClassNames)}
      size={size}
      play={play === true ? playKey : play}
      noLoop={noLoop}
      onClick={!nonInteractive ? handleClick : undefined}
      onLoad={handleLoad}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...otherProps}
    />
  );
}

export default memo(AnimatedIcon);
