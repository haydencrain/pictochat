import { useState, useCallback } from 'react';

/**
 * A React hook which provides a toggleable boolean, useful for handling the opening and closing of modal states
 * @function
 */
export function useToggleModal(): {
  /**
   * Whether the modal is active or not
   */
  isActive: boolean;
  /**
   * Sets the boolean to true
   * @function
   */
  onOpen: () => void;
  /**
   * Sets the boolean to false
   * @function
   */
  onClose: () => void;
} {
  const [isActive, setActive] = useState<boolean>(false);
  const onOpen = useCallback(() => setActive(true), []);
  const onClose = useCallback(() => setActive(false), []);
  return {
    isActive,
    onOpen,
    onClose
  };
}
