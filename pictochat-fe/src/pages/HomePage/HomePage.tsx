import * as React from 'react';
import PostsList from '../../components/PostsList';
import { Loader, Button, Modal } from 'semantic-ui-react';
import { useFetchPosts } from '../../hooks/PostsHooks';
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
          <NewPostModal buttonContent="Create Post" />
        </div>
        <PostsList posts={posts} showReplies={false} raised />
      </div>
    </section>
  );
}

function NewPostModal(props: { buttonContent: any }) {
  const [isActive, setActive] = React.useState(false);

  const handleOpen = () => setActive(true);
  const handleClose = () => setActive(false);
  const handleSubmit = () => {};

  return (
    <Modal
      trigger={
        <Button primary onClick={handleOpen}>
          {props.buttonContent}
        </Button>
      }
      open={isActive}
      onClose={handleClose}
    >
      <Modal.Header>Upload an Image</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>We've found the following gravatar image associated with your e-mail address.</p>
          <p>Is it okay to use this photo?</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button primary onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
