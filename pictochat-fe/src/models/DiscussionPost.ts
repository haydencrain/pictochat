import { PostAuthor } from './PostAuthor';

export interface DiscussionPost {
  postId: string;
  parentPostId: string;
  discussionId: string;
  imageId: string;
  isRootPost: boolean;
  author: PostAuthor;
  imageSrc: string; // URI for the post's image
  replyTreePath: string;
  commentCount?: number;
  replies?: DiscussionPost[];
  postedDate: string;
  createdAt: string;
  updatedAt: string;
}
