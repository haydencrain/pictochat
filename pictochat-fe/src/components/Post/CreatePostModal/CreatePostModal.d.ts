import React from 'react';
import { TriggerTypes } from '../../Image/ImageUploadModal';
import './CreatePostModal.less';
interface CreatePostModalProps {
    /**
     * If no id is present, this component assumes that the new post is a new Discussion post.
     * Otherwise, it is considered to be a new Reply post.
     */
    parentPostId?: string;
    /**
     * Determines whether the modal's trigger should either be a modal, or a link
     */
    triggerType: TriggerTypes;
    /**
     * The message the trigger should display
     */
    triggerContent?: any;
}
declare const _default: React.FunctionComponent<CreatePostModalProps>;
export default _default;
