import mongoose from "mongoose";

const discussionPostSchema = new mongoose.Schema({
  discussionId: String,
  parentPostId: String,
  isRootPost: Boolean, // true if the post if discussion's root post
  imageId: String, // will be used to get image by calling /api/post/image/{:imageId}
  authorId: String, // ObjectID for author's user document
  createdDatetime: Date // really a data-time object
});

export const DiscussionPost = mongoose.model(
  "DiscussionPost",
  discussionPostSchema
);
