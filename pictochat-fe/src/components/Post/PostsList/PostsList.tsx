import * as React from 'react';
import { observer } from 'mobx-react';
import { Segment, Loader } from 'semantic-ui-react';
import { DiscussionPost } from '../../../models/DiscussionPost';
import { PostTypes } from '../../../models/PostTypes';
import PostsListItem from '../PostsListItem';
import './PostsList.less';

interface PostListsProps {
  posts: DiscussionPost[];
  postsType: PostTypes;
  noPostsMessage?: string;
  isLoading?: boolean;
  showReplies: boolean;
  raised: boolean;
  shouldLoadMore?: boolean;
  onLoadMore?: () => void;
}

function PostsList(props: PostListsProps) {
  const renderPosts = () => {
    if (!props.isLoading && props.posts.length === 0 && !props.shouldLoadMore) {
      return (
        <Segment>
          <p>{props.noPostsMessage || 'Nothing to display'}</p>
        </Segment>
      );
    }

    return props.posts.map(post => {
      return (
        <PostsListItem
          key={`post_${post.postId}`}
          post={post}
          postType={props.postsType}
          showReplies={props.showReplies}
        />
      );
    });
  };

  const renderLoadMore = () =>
    props.shouldLoadMore &&
    !props.isLoading && (
      <Segment className="post-list-load-more link" onClick={() => props.onLoadMore && props.onLoadMore()}>
        Load More...
      </Segment>
    );

  const renderLoading = () =>
    props.isLoading && (
      <Segment className="post-list-loading">
        <Loader active />
      </Segment>
    );

  return (
    <Segment.Group className="post-list" raised={props.raised}>
      {renderPosts()}
      {renderLoadMore()}
      {renderLoading()}
    </Segment.Group>
  );
}

export default observer(PostsList);
