import * as React from 'react';
import { Image } from 'semantic-ui-react';
import { DiscussionPost } from '../../models/DiscussionPost';
import { Link } from 'react-router-dom';
import './Post.less';

interface PostProps {
  post: DiscussionPost;
}

export default function Post(props: PostProps) {
  const { author, postedDate, imageSrc, commentCount, postId } = props.post;
  const { userAvatarURI, userName } = author;
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
      </div>
    </div>
  );
}
