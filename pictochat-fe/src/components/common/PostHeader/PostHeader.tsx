import * as React from 'react';
import { Image } from 'semantic-ui-react';
import { DiscussionPost } from '../../../model/DiscussionPost';
import './PostHeader.less';

export function PostHeader(props: { post: DiscussionPost }) {
  return (
    <div className="post-header">
      <Image src={props.post.author.userAvatarURI} avatar />
      <span className="post-author-name">{props.post.author.userName}</span>
      <span className="post-posted-date">{props.post.postedDate}</span>
    </div>
  );
}
