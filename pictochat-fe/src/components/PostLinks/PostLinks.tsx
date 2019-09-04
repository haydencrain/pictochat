import * as React from 'react';
import { PostTypes } from '../../models/PostTypes';
import { Link } from 'react-router-dom';
import './PostLinks.less';

interface PostLinksProps {
  postType: PostTypes;
  id: string;
  commentCount: number;
}

export default function PostLinks(props: PostLinksProps) {
  const { postType, id, commentCount } = props;

  const mapLinks = (links: JSX.Element[]) =>
    links.map((link, index) => (
      <li key={`link_${index}`} className="links-list-item">
        {link}
      </li>
    ));

  const renderRootPostLinks = () => {
    const rootPostLinks = [
      <Link className="link" to={`/discussion?id=${id}`}>
        {commentCount} comments
      </Link>
    ];
    return mapLinks(rootPostLinks);
  };

  const renderReplyPostLinks = () => {
    const replyPostLinks = [
      <Link className="link" to={`/discussion?id=${id}`}>
        permalink
      </Link>,
      <div
        className="link"
        onClick={e => console.log(`I should be seeing a modal so that i can reply to post Id ${id}`)}
      >
        reply
      </div>
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
