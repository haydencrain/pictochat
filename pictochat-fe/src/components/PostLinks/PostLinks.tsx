import * as React from 'react';
import { PostTypes } from '../../models/PostTypes';
import { Link } from 'react-router-dom';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import { DiscussionPost } from '../../models/DiscussionPost';
import './PostLinks.less';

interface PostLinksProps {
  postType: PostTypes;
  post: DiscussionPost;
}

export default function PostLinks(props: PostLinksProps) {
  const { postType, post } = props;
  const { postId, commentCount, parentPostId } = post;

  const mapLinks = (links: JSX.Element[]) =>
    links.map((link, index) => (
      <li key={`link_${index}`} className="links-list-item">
        {link}
      </li>
    ));

  const renderRootPostLinks = () => {
    const rootPostLinks = [
      <Link className="link" to={`/discussion?id=${postId}`}>
        {commentCount} comments
      </Link>
    ];
    return mapLinks(rootPostLinks);
  };

  const renderReplyPostLinks = () => {
    const replyPostLinks = [
      <Link className="link" to={`/discussion?id=${postId}`}>
        permalink
      </Link>,
      <CreatePostModal triggerType="link" triggerContent="reply" parentId={parentPostId} />
    ];
    return mapLinks(replyPostLinks);
  };

  const renderLinks = () => {
    if (postType === PostTypes.Root) return renderRootPostLinks();
    if (postType === PostTypes.Reply) return renderReplyPostLinks();
    return null; // No Links should be shown on the Main Post
  };

  return (
    <div className="post-links">
      <ul className="links-list">{renderLinks()}</ul>
    </div>
  );
}
