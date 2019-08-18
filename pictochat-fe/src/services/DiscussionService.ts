import { DiscussionPost } from '../model/DiscussionPost';
//import DiscussionView from '../pages/Discussion/DiscussionView';

const DISCUSSION = {
  "discussionId": "1",
  "postId": "1",
  "author": { "userName": "user1", "userAvatarURI": "https://picsum.photos/id/523/200/300" },
  "imageSrc": "https://upload.wikimedia.org/wikipedia/commons/8/84/Exercise_Fulcrum_2017_170221-N-ON977-0077.jpg",
  "postedDate": "2019-01-01T01:00:00",
  "replies": [
    {
      "discussionId": "1",
      "postId": "2",
      "author": { "userName": "user2", "userAvatarURI": "https://picsum.photos/id/690/200/300" },
      "postedDate": "2019-01-01T01:01:00",
      "imageSrc": "https://upload.wikimedia.org/wikipedia/commons/6/65/The_Second_Boer_War%2C_1899-1902_Q72161.jpg",
      "replies": [
        {
          "discussionId": "1",
          "postId": "3",
          "author": { "userName": "user1", "userAvatarURI": "https://picsum.photos/id/523/200/300" },
          "postedDate": "2019-01-01T01:02:00",
          "imageSrc": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Emerald_Lake_IMG_5040.JPG",
          "replies": Array<any>()
        },
        {
          "discussionId": "1",
          "postId": "5",
          "author": { "userName": "user1", "userAvatarURI": "https://picsum.photos/id/523/200/300" },
          "postedDate": "2019-01-01T02:02:00",
          "imageSrc": "https://upload.wikimedia.org/wikipedia/commons/f/ff/An_Iron_Age_Unit_Iceni_Celtic_Coin_Index_reference%2C_4.066_%28FindID_293350%29.jpg",
          "replies": [
            {
              "discussionId": "1",
              "postId": "5",
              "author": { "userName": "user1", "userAvatarURI": "https://picsum.photos/id/523/200/300" },
              "postedDate": "2019-01-01T02:02:00",
              "imageSrc": "https://upload.wikimedia.org/wikipedia/commons/f/ff/An_Iron_Age_Unit_Iceni_Celtic_Coin_Index_reference%2C_4.066_%28FindID_293350%29.jpg",
              "replies": Array<any>()
            }
          ]
        },
        {
          "discussionId": "1",
          "postId": "5",
          "author": { "userName": "user1", "userAvatarURI": "https://picsum.photos/id/523/200/300" },
          "postedDate": "2019-01-01T02:02:00",
          "imageSrc": "https://upload.wikimedia.org/wikipedia/commons/f/ff/An_Iron_Age_Unit_Iceni_Celtic_Coin_Index_reference%2C_4.066_%28FindID_293350%29.jpg",
          "replies": Array<any>()
        }
      ]
    },
    {
      "discussionId": "1",
      "postId": "4",
      "author": { "userName": "user2", "userAvatarURI": "https://picsum.photos/id/690/200/300" },
      "postedDate": "2019-01-01T02:01:00",
      "imageSrc": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Barragga_Bay_-_panoramio.jpg",
      "replies": Array<any>()
    }
  ]
}

/**
 * Responsible for retreiving Discussion data from the API
 * NOTE: This currently just a stub that returns static data
 */
export class DiscussionService {

  getDiscussion(discussionId: string): Promise<DiscussionPost> {
    let discussion = DISCUSSION as DiscussionPost;
    console.log(discussion);
    return Promise.resolve(discussion);
  }

  getRootDiscussionPosts(): Promise<DiscussionPost[]> {
    let discussion = DISCUSSION as DiscussionPost;
    return Promise.resolve([discussion, discussion]);
  }
}

export default new DiscussionService();
