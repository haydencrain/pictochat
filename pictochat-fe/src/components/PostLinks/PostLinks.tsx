import * as React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import StoresContext from '../../contexts/StoresContext';
import { PostTypes } from '../../models/PostTypes';
import { User } from '../../models/User';
import { DiscussionPost } from '../../models/DiscussionPost';
import './PostLinks.less';
import EditPostModal from '../EditPostModal';
import DeletePostButton from '../DeletePostButton';

interface PostLinksProps {
  postType: PostTypes;
  post: DiscussionPost;
}

function PostLinks(props: PostLinksProps) {
  //// DATA ////
  const { post, postType } = props;
  const stores = React.useContext(StoresContext);
  const currentUser = stores.user.currentUser;

  //// HELPERS ////

  const shouldShowEditLink = (currentUser: User, post: DiscussionPost): boolean => {
    return currentUser.username === post.author.username;
  };

  const mapLinks = (links: JSX.Element[]): JSX.Element[] => {
    return links.map((link, index) => (
      <li key={`link_${index}`} className="links-list-item">
        {link}
      </li>
    ));
  };

  //// POST TYPE RENDER FUNCTIONS ////

  const renderRootPostLinks = (): JSX.Element[] => {
    const rootPostLinks = [
      <Link className="link" to={`/discussion/${post.postId}`}>
        {post.commentCount} comments
      </Link>
    ];
    return mapLinks(rootPostLinks);
  };

  const renderReplyPostLinks = (): JSX.Element[] => {
    const replyPostLinks = [
      <Link className="link" to={`/discussion/${post.postId}`}>
        permalink
      </Link>,
      <CreatePostModal triggerType="link" triggerContent="reply" parentPostId={post.postId} />
    ];
    if (shouldShowEditLink(currentUser, post)) {
      replyPostLinks.push(<EditPostModal triggerType="link" triggerContent="edit" postId={post.postId} />);
      replyPostLinks.push(<DeletePostButton postId={post.postId} />);
    }
    return mapLinks(replyPostLinks);
  };

  const renderMainPostLinks = (): JSX.Element[] => {
    if (shouldShowEditLink(currentUser, post)) {
      const replyPostLinks = [
        <EditPostModal triggerType="link" triggerContent="edit" postId={post.postId} />,
        <DeletePostButton postId={post.postId} />
      ];
      return mapLinks(replyPostLinks);
    }
    return null;
  };

  //// MAIN RENDERING ////

  let links: JSX.Element[] = null; // no links shown on the Main Post
  if (postType === PostTypes.Root) {
    links = renderRootPostLinks();
  } else if (postType === PostTypes.Reply) {
    links = renderReplyPostLinks();
  } else if (postType === PostTypes.Main) {
    links = renderMainPostLinks();
  }

  return (
    <div className="post-links">
      <ul className="links-list">{links}</ul>
    </div>
  );
}

export default observer(PostLinks);
