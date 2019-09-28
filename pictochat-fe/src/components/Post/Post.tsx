import * as React from 'react';
import * as moment from 'moment-mini';
import * as classNames from 'classnames';
import { observer } from 'mobx-react';
import { Image } from 'semantic-ui-react';
import PostLinks from '../PostLinks';
import StoresContext from '../../contexts/StoresContext';
import { DiscussionPost } from '../../models/DiscussionPost';
import { PostTypes, getPostTypeName } from '../../models/PostTypes';
import './Post.less';
import deletedPlaceholderImg from '../../images/deleted-placeholder.jpg';

interface PostProps {
  post: DiscussionPost;
  postType?: PostTypes;
}

function Post(props: PostProps) {
  const { post, postType } = props;

  const getImageSrc = () => {
    if (post.isHidden) {
      return deletedPlaceholderImg;
    }
    return post.imageSrc;
  };

  const renderLinks = () => {
    console.log('Post: ', post);
    console.log('PostType: ', postType, postType !== PostTypes.Root);
    if (post.isHidden && postType !== PostTypes.Root) {
      return null;
    }
    return <PostLinks postType={postType} post={post} />;
  };

  return (
    <section className={classNames('thread-post', getPostTypeName(postType))}>
      <div className="post-sidebar">
        <Image src={post.author.userAvatarURI} avatar size="mini" />
      </div>
      <div className="post-content">
        <div className="post-header">
          <div className="post-author">{post.author.username}</div>
          <div className="post-date">{moment(post.postedDate).fromNow()}</div>
        </div>
        <div className="post-body">
          <Image src={getImageSrc()} />
        </div>
        {renderLinks()}
      </div>
    </section>
  );
}

export default observer(Post);
