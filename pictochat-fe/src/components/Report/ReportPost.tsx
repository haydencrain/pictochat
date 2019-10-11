import React from 'react';
import { IDiscussionPost } from '../../models/store/DiscussionPost';
import { Item, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment-mini';

interface ReportPostProps {
  /**
   * The reported post to display
   */
  report: IDiscussionPost;
  /**
   * A callback function that is executed when the delete button is pressed
   * @function
   */
  onDeleteClick: () => void;
  /**
   * A callback function that is executed when the delete unflag is pressed
   * @function
   */
  onUnflagClick: () => void;
}

/**
 * A React component that displays the report view for a post. It also contains buttons to be able to unflag the
 * reported post, as well to be able to delete it entirely.
 * @component
 */
function ReportPost(props: ReportPostProps) {
  const post = () => props.report; // to ensure that mobx is able to observe the object
  return (
    <Item>
      <Item.Image src={post().imageSrc} />
      <Item.Content>
        <Item.Header>
          PostId: <Link to={`/discussion/${post().postId}`}>{post().postId}</Link>
        </Item.Header>
        <Item.Meta>{moment(post().postedDate).format()}</Item.Meta>
        <Item.Description>User: {post().author.username}</Item.Description>
        <Item.Extra>
          <Button floated="right" onClick={props.onDeleteClick}>
            Delete Post
          </Button>
          <Button floated="right" onClick={props.onUnflagClick}>
            Unflag Post
          </Button>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}

export default ReportPost;
