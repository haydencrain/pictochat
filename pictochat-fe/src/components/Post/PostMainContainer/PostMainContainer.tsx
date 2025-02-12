import * as React from 'react';
import { observer } from 'mobx-react';
import { PostTypes } from '../../../models/PostTypes';
import { Segment, Loader } from 'semantic-ui-react';
import PostItem from '../PostItem';
import StoresContext from '../../../contexts/StoresContext';
import './PostMainContainer.less';

interface PostMainContainerProps {
  /**
   * The id of the post to use
   */
  id: string;
}

/**
 * A React component that connects to mobx, and displays the current active discussion post as the main post
 * @param { PostMainContainerProps } props - The props of the component
 */
function PostMainContainer(props: PostMainContainerProps) {
  const { id } = props;
  const activeDiscussionStore = React.useContext(StoresContext).activeDiscussion;

  const renderContent = () => {
    if (activeDiscussionStore.isLoadingRoot || !activeDiscussionStore.postsMap.has(id)) {
      return <Loader active />;
    }
    const post = activeDiscussionStore.postsMap.get(id);
    return <PostItem post={post} postType={PostTypes.Main} />;
  };

  return (
    <section className="post-main-container">
      <div className="post-main-header">
        <h1>Post{!!id ? ` - ${id}` : null}</h1>
      </div>
      <Segment raised>{renderContent()}</Segment>
    </section>
  );
}

export default observer(PostMainContainer);
