import * as React from 'react';
import * as moment from 'moment-mini';
import * as classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import { DiscussionPost } from '../../models/DiscussionPost';
import { PostTypes, getPostTypeName } from '../../models/PostTypes';
import './Post.less';

interface PostProps {
  post: DiscussionPost;
  postType?: PostTypes;
}

export default function Post(props: PostProps) {
  const { postType, post } = props;
  const { author, postedDate, imageSrc, commentCount, postId } = post;
  const { userAvatarURI, userName } = author;
  return (
    <section className={classNames('thread-post', getPostTypeName(postType))}>
      <div className="post-sidebar">
        <Image src={userAvatarURI} avatar size="mini" />
      </div>
      <div className="post-content">
        <div className="post-header">
          <div className="post-author">{userName}</div>
          <div className="post-date">{moment(postedDate).fromNow()}</div>
        </div>
        <div className="post-body">
          <Image src={imageSrc} />
        </div>
        <PostLinks postType={postType} id={postId} commentCount={commentCount} />
      </div>
    </section>
  );
}

interface PostLinksProps {
  postType: PostTypes;
  id: string;
  commentCount: number;
}

function PostLinks(props: PostLinksProps) {
  const { postType, id, commentCount } = props;

  const renderRootPostLinks = () => (
    <div className="post-links">
      <Link className="link" to={`/discussion?id=${id}`}>
        {commentCount} comments
      </Link>
    </div>
  );

  const renderReplyPostLinks = () => (
    <div className="post-links">
      <Link className="link" to={`/discussion?id=${id}`}>
        permalink
      </Link>
      <div
        className="link"
        onClick={e => console.log(`I should be seeing a modal so that i can reply to post Id ${id}`)}
      >
        reply
      </div>
    </div>
  );

  if (postType === PostTypes.Root) return renderRootPostLinks();
  if (postType === PostTypes.Reply) return renderReplyPostLinks();
  return null; // No Links should be shown on the Main Post
}
