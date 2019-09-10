import * as React from 'react';
import { Segment, Loader } from 'semantic-ui-react';
import { DiscussionPost } from '../../models/DiscussionPost';
import { PostTypes } from '../../models/PostTypes';
import PostsListItem from '../PostsListItem';
import './PostsList.less';

interface PostListsProps {
  posts: DiscussionPost[];
  postsType: PostTypes;
  noPostsMessage?: string;
  isLoading?: boolean;
  showReplies: boolean;
  raised: boolean;
}

export default function PostsList(props: PostListsProps) {
  const { posts, showReplies, raised, noPostsMessage, isLoading, postsType } = props;

  const renderLoading = () => (
    <Segment className="post-list-loading">
      <Loader active />
    </Segment>
  );

  const renderNoPosts = () => (
    <Segment>
      <p>{noPostsMessage || 'Nothing to display'}</p>
    </Segment>
  );

  const renderPosts = () =>
    posts.map(post => <PostsListItem key={post.postId} post={post} postType={postsType} showReplies={showReplies} />);

  const renderContent = () => {
    if (!!isLoading) return renderLoading();
    if (posts.length > 0) return renderPosts();
    return renderNoPosts();
  };

  return (
    <Segment.Group className="post-list" raised={raised}>
      {renderContent()}
    </Segment.Group>
  );
}
