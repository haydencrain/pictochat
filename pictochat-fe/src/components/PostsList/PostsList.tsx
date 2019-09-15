import * as React from 'react';
import { observer } from 'mobx-react';
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

function PostsList(props: PostListsProps) {
  console.log(props.posts);
  const renderLoading = () => (
    <Segment className="post-list-loading">
      <Loader active />
    </Segment>
  );

  const renderNoPosts = () => (
    <Segment>
      <p>{props.noPostsMessage || 'Nothing to display'}</p>
    </Segment>
  );

  const renderPosts = () => {
    return props.posts.map((post) => {
      return <PostsListItem key={post.postId} post={post} postType={props.postsType} showReplies={props.showReplies} />;
    });
  };

  const renderContent = () => {
    if (!!props.isLoading) return renderLoading();
    if (props.posts.length > 0) return renderPosts();
    return renderNoPosts();
  };

  return (
    <Segment.Group className="post-list" raised={props.raised}>
      {renderContent()}
    </Segment.Group>
  );
}

export default observer(PostsList);
