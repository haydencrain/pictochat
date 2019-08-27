import * as React from 'react';
import { Image } from 'semantic-ui-react';
import { DiscussionPost } from '../../../model/DiscussionPost';
import { Link } from 'react-router-dom';
import ThreadPostsList from '../ThreadPostsList';
import './ThreadPost.less';

interface ThreadPostProps {
  post: DiscussionPost;
  showReplies?: boolean;
}

export default function ThreadPost(props: ThreadPostProps) {
  const { author, postedDate, imageSrc, commentCount, postId, replies } = props.post;
  const { userAvatarURI, userName } = author;
  const showReplies = !!props.showReplies;
  return (
    <div className="thread-post">
      <div className="post-sidebar">
        <Image src={userAvatarURI} avatar size="mini" />
      </div>
      <div className="post-content">
        <div className="post-header">
          <div className="post-author">{userName}</div>
          <div className="post-date">{postedDate}</div>
        </div>
        <div className="post-body">
          <Image src={imageSrc} />
        </div>
        <div className="post-links">
          <Link className="link" to={`/discussion?id=${postId}`}>
            {commentCount} comments
          </Link>
        </div>
        {showReplies && <ThreadReplies replies={replies} showReplies={showReplies} />}
      </div>
    </div>
  );
}

interface ThreadRepliesProps {
  replies: DiscussionPost[];
  showReplies?: boolean;
}

function ThreadReplies(props: ThreadRepliesProps) {
  const { replies, showReplies } = props;
  return replies && replies.length > 0 && <ThreadPostsList posts={replies} raised={false} showReplies={showReplies} />;
}
