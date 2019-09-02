import * as React from 'react';
import PostsList from '../../components/PostsList';
import { Loader } from 'semantic-ui-react';
import { useFetchPosts } from '../../hooks/PostsHooks';
import './HomePage.less';

interface HomePage {}

export default function HomePage(props: HomePage) {
  const [posts, isLoading] = useFetchPosts();
  if (isLoading) return <Loader active inline />;
  return (
    <section id="home-page">
      <div className="main">
        <h1>Threads</h1>
        <PostsList posts={posts} showReplies={false} raised />
      </div>
    </section>
  );
}
