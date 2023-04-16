import type { FC } from 'react';
import React, {
  memo, useCallback, useEffect, useRef, useState,
} from 'react';

import { copyTextToClipboard } from '../../../util/clipboard';
import clsx from 'clsx'
import { areLinesWrapping } from '../helpers/renderText';

import useWindowSize from '../../../hooks/useWindowSize';
import useLang from '../../../hooks/useLang';

import styles from './CodeOverlay.module.scss';
import { showNotification } from '../../../global/actions';

export type OwnProps = {
  className?: string;
  text: string;
  noCopy?: boolean;
  onWordWrapToggle?: (wrap: boolean) => void;
};

const CodeOverlay: FC<OwnProps> = ({
  text, className, noCopy, onWordWrapToggle,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const lang = useLang();
  const [isWordWrap, setIsWordWrap] = useState(true);
  const [withWordWrapButton, setWithWordWrapButton] = useState(false);

  const checkWordWrap = useCallback(() => {
    const isWrap = areLinesWrapping(text, ref.current!.parentElement!);
    setWithWordWrapButton(isWrap);
  }, [text]);

  useEffect(() => {
    if (isWordWrap) {
      checkWordWrap();
    }
  }, [checkWordWrap, isWordWrap, text, windowSize]);

  const handleCopy = useCallback(() => {
    copyTextToClipboard(text);
    showNotification({
      message: lang('TextCopied'),
    });
  }, [lang, showNotification, text]);

  const handleWordWrapClick = useCallback(() => {
    setIsWordWrap(!isWordWrap);
    onWordWrapToggle?.(!isWordWrap);
  }, [isWordWrap, onWordWrapToggle]);

  const contentClass = clsx(styles.content, !withWordWrapButton && noCopy && styles.hidden);
  const overlayClass = clsx(styles.overlay, className);
  const wrapClass = clsx(styles.wrap, isWordWrap && styles.wrapOn);

  return (
    <div className={overlayClass} ref={ref}>
      <div className={contentClass}>
        {withWordWrapButton && (
          <div className={wrapClass} onClick={handleWordWrapClick} title="Word Wrap">
            <i className="icon-word-wrap" />
          </div>
        )}
        {!noCopy && (
          <div className={styles.copy} onClick={handleCopy} title={lang('Copy')}>
            <i className="icon-copy" />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CodeOverlay);
