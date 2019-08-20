import * as React from 'react';
import { Image, Button, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PostHeader from '../../common/PostHeader';
import { DiscussionPost } from '../../../model/DiscussionPost';
import discussionService from '../../../services/DiscussionService';
import './DiscussionThreadsPage.less';

function ThreadSummaryComponent(props: { discussionRootPost: DiscussionPost }) {
  const rootPost = props.discussionRootPost
  const numReplies = rootPost.hasOwnProperty('replies') ? rootPost.replies.length : 0;
  return (
    <div className="thread-summary">
      <PostHeader post={rootPost} />
      <div className="thread-summary-content">
        <Image src={rootPost.imageSrc} />
      </div>
      <div className="thread-summary-links-container">
        <Link className="link" to="/discussion">Comments ({numReplies})</Link>
        {/*<Button className="link">Comments ({numReplies})</Button>*/}
        <Button className="link">Share</Button>
      </div>
    </div >
  );
}

export interface DiscussionThreadsPageProps {
  discussionRootPosts?: DiscussionPost[];
}
export class DiscussionThreadsPage extends React.Component<DiscussionThreadsPageProps, DiscussionThreadsPageProps> {
  private useState: boolean;

  constructor(props: DiscussionThreadsPageProps) {
    super(props);
    this.useState = !props.hasOwnProperty('discussionRootPosts');
    if (this.useState) {
      this.state = { discussionRootPosts: null };
      discussionService
        .getRootDiscussionPosts()
        .then((rootPosts: DiscussionPost[]) => {
          this.setState({ discussionRootPosts: rootPosts });
        })
        .catch(() => {
          console.log('Error during DiscussionThreadsPage.discussionRootPosts initialisation');
        });
    }
  }

  private getRootPosts(): DiscussionPost[] {
    return (this.useState) ? this.state.discussionRootPosts : this.props.discussionRootPosts;
  }

  render() {
    const rootPosts = this.getRootPosts();
    console.log(rootPosts);
    if (rootPosts !== null) {
      const discussionElems = rootPosts.map((rootPost: DiscussionPost, i) => {
        return <ThreadSummaryComponent discussionRootPost={rootPost} key={i} />;
      });
      return (
        <section id="discussion-threads-page">
          <div className="main-content">
            <Header>Threads - New</Header>
            <div className="threads-list">
              {discussionElems}
            </div>
          </div>
        </section>
      );
    } else {
      // render nothing
      return null;
    }
  }
}
