import * as React from 'react';
import PostsList from '../../components/PostsList';
import { Loader } from 'semantic-ui-react';
import { useFetchPosts } from '../../hooks/PostsHooks';
import CreatePostModal from '../../components/CreatePostModal/CreatePostModal';
import './HomePage.less';

interface HomePage {}

export default function HomePage(props: HomePage) {
  const [posts, isLoading] = useFetchPosts();
  if (isLoading) return <Loader active inline />;
  return (
    <section id="home-page">
      <div className="main">
        <div className="header">
          <h1>Threads</h1>
          <CreatePostModal buttonContent="Create Post" />
        </div>
        <PostsList
          posts={posts}
          noPostsMessage="No posts have been added yet! Be the first to add a post!"
          showReplies={false}
          raised
        />
      </div>
    </section>
  );
}
