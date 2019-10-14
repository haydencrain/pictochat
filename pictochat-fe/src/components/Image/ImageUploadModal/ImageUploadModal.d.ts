/// <reference types="react" />
import './ImageUploadModal.less';
export declare type TriggerTypes = 'button' | 'link';
export interface ImageUploadModalProps {
    /**
     * Provide a class name to the root element of this component
     */
    className?: string;
    /**
     * Determines whether the modal's trigger should either be a modal, or a link
     */
    triggerType: TriggerTypes;
    /**
     * The message the trigger should display
     */
    triggerContent?: any;
    /**
     * Callback function that is executed when an open trigger is activated, and is
     * used to determine whether the modal should open.
     * Return false if you want to prevent it from opening.
     * @function
     */
    shouldOpen: () => boolean;
    onSubmit: (image: File) => Promise<void>;
}
/**
 * A React component which provides an modal for uploading and submitting images.
 * @component
 * @param { ImageUploadModalProps } props - The component's props
 */
declare function ImageUploadModal(props: ImageUploadModalProps): JSX.Element;
declare const _default: typeof ImageUploadModal;
export default _default;
