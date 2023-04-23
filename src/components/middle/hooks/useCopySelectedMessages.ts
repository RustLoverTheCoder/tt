import { copySelectedMessages } from '../../../global/actions';
import { useHotkeys } from '../../../hooks/useHotkeys';

const useCopySelectedMessages = (isActive?: boolean) => {
  function handleCopy(e: KeyboardEvent) {
    e.preventDefault();
    copySelectedMessages();
  }

  useHotkeys(isActive ? { 'Mod+C': handleCopy } : undefined);
};

export default useCopySelectedMessages;
