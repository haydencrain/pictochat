/**
 * Models the discussion post attributes that can be sent to API clients.
 */
export interface DiscussionPostPayload {
  postId: number;
  discussionId: number;
  isRootPost: boolean;
  imageURI: string;
  author: {userName: string, userAvatarURI: string}
  postedDate: Date;
}
