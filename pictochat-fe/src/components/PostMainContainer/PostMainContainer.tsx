import * as React from 'react';
import { observer } from 'mobx-react';
import { useFetchPost } from '../../hooks/PostsHooks';
import { PostTypes } from '../../models/PostTypes';
import { Segment, Loader } from 'semantic-ui-react';
import Post from '../Post';
import './PostMainContainer.less';
import StoresContext from '../../contexts/StoresContext';

interface PostMainContainerProps {
  id: string;
}

function PostMainContainer(props: PostMainContainerProps) {
  const { id } = props;
  const stores = React.useContext(StoresContext);

  const renderContent = () => {
    if (stores.discussion.isLoading || !stores.discussion.activeDiscussionPosts.has(id)) {
      return <Loader active />;
    }
    const post = stores.discussion.activeDiscussionPosts.get(id);
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

export default observer(PostMainContainer);
