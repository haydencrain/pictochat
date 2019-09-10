export default interface NewPostPayload {
  userId: string;
  image: File;
  parentId?: string;
  discussionId?: string;
}
