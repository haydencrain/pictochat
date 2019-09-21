import * as React from 'react';
import { observer } from 'mobx-react';
import { PostTypes } from '../../models/PostTypes';
import { Link } from 'react-router-dom';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import { DiscussionPost } from '../../models/DiscussionPost';
import './PostLinks.less';
import StoresContext from '../../contexts/StoresContext';
import { User } from '../../models/User';
import { computed } from 'mobx';

interface PostLinksProps {
  postType: PostTypes;
  post: DiscussionPost;
}

function shouldShowEditLink(currentUser: User, post: DiscussionPost) {
  return currentUser.username === post.author.username;
}

function PostLinks(props: PostLinksProps) {
  // Data
  const stores = React.useContext(StoresContext);
  const currentUser = stores.user.currentUser;

  const mapLinks = (links: JSX.Element[]) =>
    links.map((link, index) => (
      <li key={`link_${index}`} className="links-list-item">
        {link}
      </li>
    ));

  const renderRootPostLinks = () => {
    const rootPostLinks = [
      <Link className="link" to={`/discussion?id=${props.post.postId}`}>
        {props.post.commentCount} comments
      </Link>
    ];
    return mapLinks(rootPostLinks);
  };

  const renderReplyPostLinks = () => {
    let replyPostLinks = [
      <Link className="link" to={`/discussion?id=${props.post.postId}`}>
        permalink
      </Link>,
      <CreatePostModal triggerType="link" triggerContent="reply" parentPostId={props.post.postId} />
    ];
    if (shouldShowEditLink(stores.user.currentUser, props.post)) {
      replyPostLinks.push(
        <CreatePostModal triggerType="link" triggerContent="reply" parentPostId={props.post.postId}/>
      );
    }
    return mapLinks(replyPostLinks);
  };

  const renderLinks = computed(() => {
    if (props.postType === PostTypes.Root) return renderRootPostLinks();
    if (props.postType === PostTypes.Reply) return renderReplyPostLinks();
    return null; // No Links should be shown on the Main Post
  });

  return (
    <div className="post-links">
      <ul className="links-list">{renderLinks.get()}</ul>
    </div>
  );
}

export default observer(PostLinks);
