import * as React from 'react';
import { Image, Button, Header, Divider } from 'semantic-ui-react';
import { DiscussionPost } from '../../../model/DiscussionPost';
import discussionService from '../../../services/DiscussionService';
import './DiscussionPage.less';


// HELPER COMPONENTS

function PostActionsGroup(props: {}) {
  return (
    <div>
      <Button>Edit</Button>
      <Button>Reply</Button>
      <Button>React</Button>
    </div>
  );
}

function PostHeader(props: { post: DiscussionPost }) {
  return (
    <div className="post-header">
      <Image src={props.post.author.userAvatarURI} avatar />
      <span className="post-author-name">{props.post.author.userName}</span>
      <span className="post-posted-date">{props.post.postedDate}</span>
    </div>
  );
}

function PostRepliesSection(props: { replies: DiscussionPost[] }) {
  if (props.replies.length > 0) {
    const replies = props.replies.map((replyPost: DiscussionPost, i) => {
      return <PostView post={replyPost} key={replyPost.postId} />;
    });
    return (
      <div className="post-replies-container">
        {replies}
      </div>
    );
  } else {
    // Render nothing
    return null;
  }
}

function PostView(props: { post: DiscussionPost }): any {
  let postClasses = "post-container";
  if (props.post.replies.length === 0) {
    postClasses += " no-replies";
  }
  return (
    <div className={postClasses}>
      <div className="post-header-content-container">
        <PostHeader post={props.post} />
        <div className="post-content">
          <Image
            className="post-content"
            src={props.post.imageSrc} />
        </div>
        <PostActionsGroup />
      </div>
      <PostRepliesSection replies={props.post.replies} />
    </div>
  );
}

// PAGE COMPONENT

interface DiscussionViewProps {
  discussion?: DiscussionPost;
}
export class DiscussionView extends React.Component<DiscussionViewProps, DiscussionViewProps> {
  private useState: boolean;

  constructor(props: DiscussionViewProps) {
    super(props);
    // NOTE: Temporarily adding state here for testing purposes
    //      This should be pulled out into a discussion store
    this.useState = !props.hasOwnProperty('discussion');
    if (this.useState) {
      this.state = {
        discussion: null
      };
      discussionService.getDiscussion("1")
        .then((discussion: DiscussionPost) => {
          this.setState({ discussion: discussion });
        })
        .catch(() => console.log('Error occured during DiscussionView.state.discussion initialization'));
    }
  }

  render() {
    const rootPost = this.getDiscussion();
    if (rootPost !== null) {
      const rootReplies = rootPost.replies.map((post: DiscussionPost) => {
        return <PostView post={post} key={post.postId} />
      });
      return (
        <section id="discussion-page" className="discussion-view-container">
          {this.renderRootPost(rootPost)}
          <Header as="h2">Replies ({rootPost.replies.length})</Header>
          <div className="root-replies-container">
            {rootReplies}
            {/*<PostView post={rootPost} level={0} />*/}
          </div>
        </section>
      );
    } else {
      return <div>Loading...</div>;
    }
  }

  private getDiscussion() {
    return this.useState ? this.state.discussion : this.props.discussion;
  }

  private renderRootPost(rootPost: DiscussionPost): any {
    return (
      <div className="root-post-container">
        <a>&#8617; View all threads</a>
        <PostHeader post={rootPost} />
        <Image className="post-content" src={rootPost.imageSrc} />
        <PostActionsGroup />
      </div>
    );
  }
}

export default DiscussionView;
