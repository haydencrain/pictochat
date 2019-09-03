import { useState, useCallback } from 'react';

export function useToggleModal() {
  const [isActive, setActive] = useState(false);
  const onOpen = useCallback(() => setActive(true), []);
  const onClose = useCallback(() => setActive(false), []);
  return {
    isActive,
    onOpen,
    onClose
  };
}
