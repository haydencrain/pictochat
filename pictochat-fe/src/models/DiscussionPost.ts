import { PostAuthor } from './PostAuthor';

export interface DiscussionPost {
  discussionId: string;
  postId: string;
  postedDate: string;
  author: PostAuthor;
  imageSrc: string; // URI for the post's image
  replies?: DiscussionPost[];
  commentCount?: number;
}
