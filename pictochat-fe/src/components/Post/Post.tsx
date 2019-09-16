import * as React from 'react';
import * as moment from 'moment-mini';
import * as classNames from 'classnames';
import { observer } from 'mobx-react';
import PostLinks from '../PostLinks';
import { Image } from 'semantic-ui-react';
import { DiscussionPost } from '../../models/DiscussionPost';
import { PostTypes, getPostTypeName } from '../../models/PostTypes';
import './Post.less';
import StoresContext from '../../contexts/StoresContext';

interface PostProps {
  post: DiscussionPost;
  postType?: PostTypes;
}

function Post(props: PostProps) {
  const stores = React.useContext(StoresContext);
  // NOTE: Destructuring breaks binding to mobx observables
  // const { postType, post } = props;
  // const { author, postedDate, imageSrc } = post;
  // const { userAvatarURI, userName } = author;
  return (
    <section className={classNames('thread-post', getPostTypeName(props.postType))}>
      <div className="post-sidebar">
        <Image src={props.post.author.userAvatarURI} avatar size="mini" />
      </div>
      <div className="post-content">
        <div className="post-header">
          <div className="post-author">{props.post.author.userName}</div>
          <div className="post-date">{moment(props.post.postedDate).fromNow()}</div>
        </div>
        <div className="post-body">
          <Image src={props.post.imageSrc} />
        </div>
        <PostLinks postType={props.postType} post={props.post} />
      </div>
    </section >
  );
}

export default observer(Post);
