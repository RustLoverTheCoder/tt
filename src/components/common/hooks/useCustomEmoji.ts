import { useCallback, useEffect, useState } from "react";

import type { ApiSticker } from "../../../api/types";

import {
  addCustomEmojiCallback,
  removeCustomEmojiCallback,
} from "../../../util/customEmojiManager";

import useEnsureCustomEmoji from "../../../hooks/useEnsureCustomEmoji";
import { useAtom } from "jotai";
import { customEmojisAtom } from "../../../global";

export default function useCustomEmoji(documentId?: string) {
  const customEmojis = useAtom(customEmojisAtom);
  const [customEmoji, setCustomEmoji] = useState<ApiSticker | undefined>(
    // @ts-ignore
    documentId ? customEmojis.byId[documentId] : undefined
  );

  useEnsureCustomEmoji(documentId);

  const handleGlobalChange = useCallback(() => {
    if (!documentId) return;
    // @ts-ignore
    setCustomEmoji(customEmojis.byId[documentId]);
  }, [documentId]);

  useEffect(handleGlobalChange, [documentId, handleGlobalChange]);

  useEffect(() => {
    if (customEmoji || !documentId) return undefined;

    addCustomEmojiCallback(handleGlobalChange, documentId);

    return () => {
      removeCustomEmojiCallback(handleGlobalChange);
    };
  }, [customEmoji, documentId, handleGlobalChange]);

  return customEmoji;
}
