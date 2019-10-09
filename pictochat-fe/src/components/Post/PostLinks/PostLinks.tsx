import * as React from 'react';
import { observer } from 'mobx-react';
import ReportPostButton from '../ReportPostButton';
import { PostTypes } from '../../../models/PostTypes';
import { DiscussionPost } from '../../../models/DiscussionPost';
import StoresContext from '../../../contexts/StoresContext';
import EditPostModal from '../EditPostModal';
import DeletePostButton from '../DeletePostButton';
import User from '../../../models/User';
import { Link } from 'react-router-dom';
import CreatePostModal from '../CreatePostModal';
import './PostLinks.less';

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

  const getCrudLinks = () => [
    <EditPostModal triggerType="link" triggerContent="edit" postId={post.postId} />,
    <DeletePostButton postId={post.postId} />
  ];

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
    let replyPostLinks = [
      <Link className="link" to={`/discussion/${post.postId}`}>
        permalink
      </Link>,
      <CreatePostModal triggerType="link" triggerContent="reply" parentPostId={post.postId} />,
      <ReportPostButton postId={post.postId} />
    ];
    if (shouldShowEditLink(currentUser, post)) {
      replyPostLinks = [...replyPostLinks, ...getCrudLinks()];
    }
    return mapLinks(replyPostLinks);
  };

  const renderMainPostLinks = (): JSX.Element[] => {
    let mainPostLinks = [<ReportPostButton postId={post.postId} />];
    if (shouldShowEditLink(currentUser, post)) {
      mainPostLinks = [...mainPostLinks, ...getCrudLinks()];
    }
    return mapLinks(mainPostLinks);
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
