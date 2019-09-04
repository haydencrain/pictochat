import { useState, useCallback } from 'react';

export function useToggleModal(): { isActive: boolean; onOpen: () => void; onClose: () => void } {
  const [isActive, setActive] = useState<boolean>(false);
  const onOpen = useCallback(() => setActive(true), []);
  const onClose = useCallback(() => setActive(false), []);
  return {
    isActive,
    onOpen,
    onClose
  };
}
