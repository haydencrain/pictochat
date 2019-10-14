export default interface NewPostPayload {
    /**
     * The id of the user creating the post
     */
    userId: string;
    /**
     * The image to upload
     */
    image: File;
    /**
     * If this new post is a reply, then this id should be the id of the parent post
     */
    parentPostId?: string;
    /**
     * The discussion id (if the post is a reply post)
     */
    discussionId?: string;
}
