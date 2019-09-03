import * as React from 'react';
import PostsList from '../../components/PostsList';
import { Loader, Button, Modal } from 'semantic-ui-react';
import { useFetchPosts } from '../../hooks/PostsHooks';
import ImageUpload from '../../components/ImageUpload';
import { readFile } from '../../utils/fileHelpers';
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
  const [image, setImage] = React.useState<string>();
  const handleOpen = () => setActive(true);
  const handleClose = () => setActive(false);
  const handleImageUpload = async (file: File) => {
    const binaryStr = await readFile(file);
    setImage(binaryStr.toString());
  };
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
      closeIcon={false}
    >
      <Modal.Header>Upload an Image</Modal.Header>
      <Modal.Content>
        <ImageUpload onImageUpload={handleImageUpload} />
        {!!image && <img src={image} />}
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
