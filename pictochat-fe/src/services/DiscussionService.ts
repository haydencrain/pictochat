import { DiscussionPost, IDiscussionPost } from '../models/DiscussionPost';
import ApiService from './ApiService';
import NewPostPayload from '../models/NewPostPayload';

export class DiscussionService {
  static async getDiscussions(): Promise<DiscussionPost[]> {
    return await ApiService.get(`/discussion`);
  }

  static async getPost(postId: string): Promise<DiscussionPost> {
    return await ApiService.get(`/post/${postId}`);
  }

  static async getPostReplies(discussionId: string): Promise<DiscussionPost[]> {
    const discussion = await this.getPost(discussionId);
    return discussion.replies.toJS();
  }

  static async createPost(post: NewPostPayload): Promise<IDiscussionPost> {
    const isReplyPost: boolean = !!post.parentPostId;
    // IMPORTANT: Image must be the last field appended to form data or the server will not see the other fields
    const formData = new FormData();
    formData.append('userId', post.userId);
    if (isReplyPost) {
      formData.append('parentPostId', post.parentPostId);
    }
    formData.append('image', post.image);

    let response = await ApiService.post('/post', formData, null);
    console.log('response: ', response);
    // TODO: Have backend return API URL path that can be used retireve newly created post resource
    return await DiscussionService.getPost(response.postId || response.rootPostId);
  }
}

export default DiscussionService;
