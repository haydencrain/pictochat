/// <reference types="react" />
import { IDiscussionPost } from '../../models/store/DiscussionPost';
interface ReportPostProps {
    /**
     * The reported post to display
     */
    report: IDiscussionPost;
    /**
     * A callback function that is executed when the delete button is pressed
     * @function
     */
    onDeleteClick: () => void;
    /**
     * A callback function that is executed when the delete unflag is pressed
     * @function
     */
    onUnflagClick: () => void;
}
/**
 * A React component that displays the report view for a post. It also contains buttons to be able to unflag the
 * reported post, as well to be able to delete it entirely.
 * @component
 */
declare function ReportPost(props: ReportPostProps): JSX.Element;
export default ReportPost;
