import * as React from 'react';
import {DiscussionPost} from '../../model/DiscussionPost';
import discussionService from '../../services/DiscussionService';
import './DiscussionView.less';

function PostView(props: {post: DiscussionPost, level: number}): any {
  const replies = props.post.replies.map((replyPost: DiscussionPost) => {
    return <PostView post={replyPost} key={replyPost.postId} level={props.level + 1}/>;
  });
  return (
    <div className="post-view-container">
      <div className="post-view-user-details">
        <span className="post-view-username">{props.post.author.userName}</span>
        <span className="post-view-posted-date">{props.post.postedDate}</span>
      </div>
      <div className="post-view-content">
        <img className="post-view"
            src={props.post.imageSrc} 
            //height={props.level*0.1 + />
            />
      </div>
      <div className="post-view-replies">
        {replies}
      </div>
    </div>
  );
}

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
          this.setState({discussion: discussion});
        })
        .catch(() => console.log('Error occured during DiscussionView.state.discussion initialization'));
    }
  }

  getDiscussion() {
    return this.useState ? this.state.discussion : this.props.discussion;
  }

  render() {
    const discussion = this.getDiscussion();
    if (discussion !== null) {
      return (
        <div className="discussion-view-container">
          <div className="root-post">
            <PostView post={discussion} level={0}/>
          </div>
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}

export default DiscussionView;