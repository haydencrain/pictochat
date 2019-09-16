export default interface NewPostPayload {
  userId: string;
  image: File;
  parentPostId?: string;
  discussionId?: string;
}
