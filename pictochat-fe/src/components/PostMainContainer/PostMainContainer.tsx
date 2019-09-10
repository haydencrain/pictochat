import * as React from 'react';
import { useFetchPost } from '../../hooks/PostsHooks';
import { PostTypes } from '../../models/PostTypes';
import { Segment, Loader } from 'semantic-ui-react';
import Post from '../Post';
import './PostMainContainer.less';

interface PostMainContainerProps {
  id: string;
}

export default function PostMainContainer(props: PostMainContainerProps) {
  const { id } = props;
  const [post, isLoading] = useFetchPost(id);

  const renderContent = () => {
    if (isLoading) return <Loader active />;
    return <Post post={post} postType={PostTypes.Main} />;
  };
  return (
    <section className="post-main-container">
      <div className="post-main-header">
        <h1>Thread</h1>
      </div>
      <Segment raised>{renderContent()}</Segment>
    </section>
  );
}