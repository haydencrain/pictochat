/**
 * A React hook which provides a toggleable boolean, useful for handling the opening and closing of modal states
 * @function
 */
export declare function useToggleModal(): {
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
};
