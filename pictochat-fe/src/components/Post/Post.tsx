import * as React from 'react';
import * as moment from 'moment-mini';
import * as classNames from 'classnames';
import PostLinks from '../PostLinks';
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
