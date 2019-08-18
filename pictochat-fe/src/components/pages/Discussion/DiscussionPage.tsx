import * as React from 'react';
import { Image, Button, Header, Label, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PostHeader from '../../common/PostHeader';
import { DiscussionPost } from '../../../model/DiscussionPost';
import discussionService from '../../../services/DiscussionService';
import './DiscussionPage.less';


// HELPER COMPONENTS

function PostActionsGroup(props: {}) {
  return (
    <div>
      <Button className="link">Edit</Button>
      <Button className="link">Reply</Button>
      <Button className="link">React</Button>
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
      <div className="post-header-and-content-container">
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
  static readonly REPLIES_SORT_OPTIONS = [
    { key: 'MOST_RECENT', value: 'MOST_RECENT', text: 'Most Recent' }
  ];

  private useState: boolean;

  constructor(props: DiscussionViewProps) {
    super(props);
    // NOTE: Temporarily adding state here for testing purposes
    //      This should be pulled out into a discussion store
    this.useState = !props.hasOwnProperty('discussion');
    if (this.useState) {
      this.state = { discussion: null };
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
          <div className="root-replies-header-container">
            <Header as="span">Replies</Header>
            <span className="replies-sort-by-container right-aligning-block-container">
              <Label htmlFor="replies-sort-by-input">Sort By: </Label>
              <Dropdown
                id="replies-sort-by-input"
                options={DiscussionView.REPLIES_SORT_OPTIONS}
                selection
                defaultValue={DiscussionView.REPLIES_SORT_OPTIONS[0].value} />
            </span>
          </div>
          <div className="root-replies-container">
            {rootReplies}
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
        <Link to="/threads">&#8617; View all threads</Link>
        <PostHeader post={rootPost} />
        <Image className="root-post-content" src={rootPost.imageSrc} />
        <PostActionsGroup />
      </div>
    );
  }
}

export default DiscussionView;
