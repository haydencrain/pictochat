/// <reference types="react" />
import { TriggerTypes } from '../../Image/ImageUploadModal';
import './EditPostModal.less';
interface EditPostModalProps {
    /**
     * The id of the post to edit
     */
    postId: string;
    /**
     * Determines whether the modal's trigger should either be a modal, or a link
     */
    triggerType: TriggerTypes;
    /**
     * The message the trigger should display
     */
    triggerContent?: any;
}
/**
 * React component that extends functionality of the ImageUploadModal.
 * This component will update a Post's image on submit.
 * @param { EditPostModalProps } props - The props of the component
 */
declare function EditPostModal(props: EditPostModalProps): JSX.Element;
declare const _default: typeof EditPostModal;
export default _default;
