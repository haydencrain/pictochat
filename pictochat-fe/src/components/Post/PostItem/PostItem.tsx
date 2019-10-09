import * as React from 'react';
import * as moment from 'moment-mini';
import * as classNames from 'classnames';
import { observer, Observer } from 'mobx-react';
import { Image } from 'semantic-ui-react';
import PostLinks from '../PostLinks';
import { DiscussionPost } from '../../../models/DiscussionPost';
import { PostTypes, getPostTypeName } from '../../../models/PostTypes';
import ReactionsContainer from '../../Reaction/ReactionsContainer';
import ShowImageModal from '../../Image/ShowImageModal';
import { computed } from 'mobx';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import UserService from '../../../services/UserService';
import deletedPlaceholderImg from '../../../images/deleted-placeholder.jpg';
import './PostItem.less';

interface PostItemProps extends RouteComponentProps<any> {
  post: DiscussionPost;
  postType?: PostTypes;
}

function PostItem(props: PostItemProps) {
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
      <ReactionsContainer postId={props.post.postId} shouldLoad={postType === PostTypes.Root} />
    </section>
  );
}

export default observer(withRouter(PostItem));
