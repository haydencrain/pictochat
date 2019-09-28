import * as React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import StoresContext from '../../contexts/StoresContext';
import { PostTypes } from '../../models/PostTypes';
import { User } from '../../models/User';
import { DiscussionPost } from '../../models/DiscussionPost';
import './PostLinks.less';

interface PostLinksProps {
  postType: PostTypes;
  post: DiscussionPost;
}

//// COMPONENT ////

function PostLinks(props: PostLinksProps) {
  const { post, postType } = props;
  const stores = React.useContext(StoresContext);
  const currentUser = stores.user.currentUser;

  let links: JSX.Element[] = null; // no links shown on the Main Post
  if (postType === PostTypes.Root) {
    links = renderRootPostLinks(post);
  } else if (postType === PostTypes.Reply) {
    links = renderReplyPostLinks(post, currentUser);
  }

  return (
    <div className="post-links">
      <ul className="links-list">{links}</ul>
    </div>
  );
}

export default observer(PostLinks);

//// POST TYPE RENDER FUNCTIONS ////

function renderRootPostLinks(post: DiscussionPost): JSX.Element[] {
  const rootPostLinks = [
    <Link className="link" to={`/discussion?id=${post.postId}`}>
      {post.commentCount} comments
    </Link>
  ];
  return mapLinks(rootPostLinks);
}

function renderReplyPostLinks(post: DiscussionPost, currentUser: User): JSX.Element[] {
  let replyPostLinks = [
    <Link className="link" to={`/discussion?id=${post.postId}`}>
      permalink
    </Link>,
    <CreatePostModal triggerType="link" triggerContent="reply" parentPostId={post.postId} />
  ];
  if (shouldShowEditLink(currentUser, post)) {
    const model = <CreatePostModal triggerType="link" triggerContent="reply" parentPostId={post.postId} />;
    replyPostLinks.push(model);
  }
  return mapLinks(replyPostLinks);
}

//// HELPERS ////

function shouldShowEditLink(currentUser: User, post: DiscussionPost): boolean {
  return currentUser.username === post.author.username;
}

function mapLinks(links: JSX.Element[]): JSX.Element[] {
  return links.map((link, index) => (
    <li key={`link_${index}`} className="links-list-item">
      {link}
    </li>
  ));
}
