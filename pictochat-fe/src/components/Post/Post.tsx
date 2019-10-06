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
import deletedPlaceholderImg from '../../images/deleted-placeholder.jpg';
import ShowImageModal from '../ShowImageModal';
import { computed } from 'mobx';

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
        <Image src={post.author.userAvatarURI} avatar size="mini" />
      </div>
      <div className="post-content">
        <div className="post-header">
          <div className="post-author">{post.author.username}</div>
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
    </section>
  );
}

export default observer(Post);
