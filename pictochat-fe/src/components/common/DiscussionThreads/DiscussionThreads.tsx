import * as React from 'react';
import { Segment } from 'semantic-ui-react';
import { DiscussionPost } from '../../../model/DiscussionPost';
import ThreadSummary from '../ThreadSummary';
import discussionService from '../../../services/DiscussionService';
import './DiscussionThreads.less';

export interface DiscussionThreadsProps {
  discussionRootPosts?: DiscussionPost[];
}
export class DiscussionThreads extends React.Component<DiscussionThreadsProps, DiscussionThreadsProps> {
  private useState: boolean;

  constructor(props: DiscussionThreadsProps) {
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
          console.log('Error during DiscussionThreads.discussionRootPosts initialisation');
        });
    }
  }

  private getRootPosts(): DiscussionPost[] {
    return this.useState ? this.state.discussionRootPosts : this.props.discussionRootPosts;
  }

  render() {
    const rootPosts = this.getRootPosts();
    if (rootPosts !== null) {
      const discussionElems = rootPosts.map((rootPost: DiscussionPost, i) => {
        return (
          <Segment key={i}>
            <ThreadSummary discussionRootPost={rootPost} />
          </Segment>
        );
      });
      return <Segment.Group raised>{discussionElems}</Segment.Group>;
    } else {
      // render nothing
      return null;
    }
  }
}
