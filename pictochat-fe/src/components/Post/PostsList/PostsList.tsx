import * as React from 'react';
import { Segment, Loader } from 'semantic-ui-react';
import { DiscussionPost } from '../../../models/store/DiscussionPost';
import { PostTypes } from '../../../models/PostTypes';
import PostsListItem from '../PostsListItem';
import './PostsList.less';

interface PostListsProps {
  /**
   * The posts to display
   */
  posts: DiscussionPost[];
  /**
   * The type of the posts (Main, Root, or Reply)
   */
  postsType: PostTypes;
  /**
   * Message to be displayed when no posts are passed into the component
   */
  noPostsMessage?: string;
  /**
   * Component will display a loader if set to true
   */
  isLoading?: boolean;
  /**
   * Set to true if each post should display its replies (aka display the reply tree)
   */
  showReplies: boolean;
  /**
   * Set to true if the segment containing the posts list should be raised
   */
  raised: boolean;
  /**
   * Set to true to display a 'Load More...' component at the end of segment
   */
  shouldLoadMore?: boolean;
  /**
   * Callback function that is executed when the 'Load More...' segment is pressed
   * @function
   */
  onLoadMore?: () => void;
}

/**
 * A React component that renders a segmented list of posts
 * @param { PostListsProps } props - The props of the component
 */
function PostsList(props: PostListsProps) {
  const renderPosts = () => {
    if (!props.isLoading && props.posts.length === 0 && !props.shouldLoadMore) {
      return (
        <Segment>
          <p>{props.noPostsMessage || 'Nothing to display'}</p>
        </Segment>
      );
    }

    return props.posts.map(post => (
      <PostsListItem
        key={`post_${post.postId}`}
        post={post}
        postType={props.postsType}
        showReplies={props.showReplies}
      />
    ));
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

export default PostsList;
