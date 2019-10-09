import * as React from 'react';
import { observer } from 'mobx-react';
import { PostTypes } from '../../../models/PostTypes';
import { Segment, Loader } from 'semantic-ui-react';
import PostItem from '../PostItem';
import StoresContext from '../../../contexts/StoresContext';
import './PostMainContainer.less';

interface PostMainContainerProps {
  id: string;
}

function PostMainContainer(props: PostMainContainerProps) {
  const { id } = props;
  const stores = React.useContext(StoresContext);

  const renderContent = () => {
    if (stores.discussion.isLoadingActiveDiscussion || !stores.discussion.activeDiscussionPosts.has(id)) {
      return <Loader active />;
    }
    const post = stores.discussion.activeDiscussionPosts.get(id);
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