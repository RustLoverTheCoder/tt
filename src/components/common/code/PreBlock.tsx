import type { FC } from "react";
import React, { memo, useCallback, useState } from "react";

import clsx from "clsx";

import CodeOverlay from "./CodeOverlay";

type OwnProps = {
  text: string;
  noCopy?: boolean;
};

const PreBlock: FC<OwnProps> = ({ text, noCopy }) => {
  const [isWordWrap, setWordWrap] = useState(true);

  const handleWordWrapToggle = useCallback((wrap: any) => {
    setWordWrap(wrap);
  }, []);

  const blockClass = clsx("text-entity-pre", !isWordWrap && "no-word-wrap");

  return (
    <pre className={blockClass}>
      <div className="pre-code custom-scroll-x">{text}</div>
      <CodeOverlay
        text={text}
        className="code-overlay"
        onWordWrapToggle={handleWordWrapToggle}
        noCopy={noCopy}
      />
    </pre>
  );
};

export default memo(PreBlock);
