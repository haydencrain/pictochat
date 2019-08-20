import * as React from 'react';
import PostHeader from '../PostHeader';
import { DiscussionPost } from '../../../model/DiscussionPost';
import { Link } from 'react-router-dom';
import { Button, Image } from 'semantic-ui-react';
import './ThreadSummary.less';

export default (props: { discussionRootPost: DiscussionPost }) => {
  const rootPost = props.discussionRootPost;
  const numReplies = rootPost.hasOwnProperty('replies') ? rootPost.replies.length : 0;
  return (
    <div className="thread-summary">
      <PostHeader post={rootPost} />
      <div className="thread-summary-content">
        <Image src={rootPost.imageSrc} />
      </div>
      <div className="thread-summary-links-container">
        <Link className="link" to="/discussion">
          Comments ({numReplies})
        </Link>
        {/*<Button className="link">Comments ({numReplies})</Button>*/}
        <Button className="link">Share</Button>
      </div>
    </div>
  );
};
