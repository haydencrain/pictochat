/// <reference types="react" />
import './ShowImageModal.less';
export interface ShowImageModalProps {
    /**
     * The Image url (or data) to load
     */
    imageSrc: string;
    /**
     * The element that (when clicked) will trigger the modal to open
     */
    trigger: JSX.Element;
}
/**
 * A React component which provides an modal for viewing an image
 * @component
 * @param { ShowImageModalProps } props - The component's props
 */
export default function ShowImageModal(props: ShowImageModalProps): JSX.Element;
