import * as React from 'react';
import { observer } from 'mobx-react';
import { PostTypes } from '../../models/PostTypes';
import { Link } from 'react-router-dom';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import { DiscussionPost } from '../../models/DiscussionPost';
import './PostLinks.less';

interface PostLinksProps {
  postType: PostTypes;
  post: DiscussionPost;
}

function PostLinks(props: PostLinksProps) {
  // const { postType, post } = props;
  // const { postId, commentCount, parentPostId } = post;

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
    const replyPostLinks = [
      <Link className="link" to={`/discussion?id=${props.post.postId}`}>
        permalink
      </Link>,
      <CreatePostModal triggerType="link" triggerContent="reply" parentPostId={props.post.postId} />
    ];
    return mapLinks(replyPostLinks);
  };

  const renderLinks = () => {
    if (props.postType === PostTypes.Root) return renderRootPostLinks();
    if (props.postType === PostTypes.Reply) return renderReplyPostLinks();
    return null; // No Links should be shown on the Main Post
  };

  return (
    <div className="post-links">
      <ul className="links-list">{renderLinks()}</ul>
    </div>
  );
}

export default observer(PostLinks);
