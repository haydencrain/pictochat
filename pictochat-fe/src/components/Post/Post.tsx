import * as React from 'react';
import * as moment from 'moment-mini';
import * as classNames from 'classnames';
import { observer, Observer } from 'mobx-react';
import { Image } from 'semantic-ui-react';
import PostLinks from '../PostLinks';
import StoresContext from '../../contexts/StoresContext';
import { DiscussionPost } from '../../models/DiscussionPost';
import { PostTypes, getPostTypeName } from '../../models/PostTypes';
import './Post.less';
import Reactions from '../Reactions';
import deletedPlaceholderImg from '../../images/deleted-placeholder.jpg';
import ShowImageModal from '../ShowImageModal';
import { computed } from 'mobx';
import { Link } from 'react-router-dom';
import UserService from '../../services/UserService';

interface PostProps {
  post: DiscussionPost;
  postType?: PostTypes;
}

function Post(props: PostProps) {
  const { post, postType } = props;

  const renderLinks = computed(() => {
    if (post.isHidden && postType !== PostTypes.Root) {
      return null;
    }
    return <PostLinks postType={postType} post={post} />;
  });

  const imageSrc = computed(() => (post.isHidden ? deletedPlaceholderImg : post.imageSrc));

  return (
    <section className={classNames('thread-post', getPostTypeName(postType))}>
      <div className="post-sidebar">
        <Link to={UserService.getUserUrl(post.author.username)}>
          <Image src={post.author.userAvatarURI} avatar size="mini" />
        </Link>
      </div>
      <div className="post-content">
        <div className="post-header">
          <Link className="post-author inherit" to={UserService.getUserUrl(post.author.username)}>
            {post.author.username}
          </Link>
          <div className="post-date">{moment(post.postedDate).fromNow()}</div>
        </div>
        <div className="post-body">
          <ShowImageModal
            trigger={<Observer>{() => <Image src={imageSrc.get()} />}</Observer>}
            imageSrc={imageSrc.get()}
          />
        </div>
        {renderLinks.get()}
      </div>
      <Reactions postId={Number(props.post.postId)} />
    </section>
  );
}

export default observer(Post);
