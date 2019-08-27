import { DiscussionPost } from '../model/DiscussionPost';
//import DiscussionView from '../pages/Discussion/DiscussionView';

const getRandDogUrl = () => `https://placedog.net/600?random&id=${Math.floor(Math.random() * 20) + 1}`;

const DISCUSSION = {
  discussionId: '1',
  postId: '1',
  author: { userName: 'user1', userAvatarURI: 'https://picsum.photos/id/523/200/300' },
  imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Exercise_Fulcrum_2017_170221-N-ON977-0077.jpg',
  postedDate: '2019-01-01T01:00:00',
  replies: [
    {
      discussionId: '1',
      postId: '2',
      author: { userName: 'user2', userAvatarURI: 'https://picsum.photos/id/690/200/300' },
      postedDate: '2019-01-01T01:01:00',
      imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/6/65/The_Second_Boer_War%2C_1899-1902_Q72161.jpg',
      replies: [
        {
          discussionId: '1',
          postId: '3',
          author: { userName: 'user1', userAvatarURI: 'https://picsum.photos/id/523/200/300' },
          postedDate: '2019-01-01T01:02:00',
          imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Emerald_Lake_IMG_5040.JPG',
          replies: Array<any>()
        },
        {
          discussionId: '1',
          postId: '5',
          author: { userName: 'user1', userAvatarURI: 'https://picsum.photos/id/523/200/300' },
          postedDate: '2019-01-01T02:02:00',
          imageSrc:
            'https://upload.wikimedia.org/wikipedia/commons/f/ff/An_Iron_Age_Unit_Iceni_Celtic_Coin_Index_reference%2C_4.066_%28FindID_293350%29.jpg',
          replies: [
            {
              discussionId: '1',
              postId: '10',
              author: { userName: 'user1', userAvatarURI: 'https://picsum.photos/id/523/200/300' },
              postedDate: '2019-01-01T02:02:00',
              imageSrc:
                'https://upload.wikimedia.org/wikipedia/commons/f/ff/An_Iron_Age_Unit_Iceni_Celtic_Coin_Index_reference%2C_4.066_%28FindID_293350%29.jpg',
              replies: Array<any>()
            }
          ]
        },
        {
          discussionId: '1',
          postId: '11',
          author: { userName: 'user1', userAvatarURI: 'https://picsum.photos/id/523/200/300' },
          postedDate: '2019-01-01T02:02:00',
          imageSrc:
            'https://upload.wikimedia.org/wikipedia/commons/f/ff/An_Iron_Age_Unit_Iceni_Celtic_Coin_Index_reference%2C_4.066_%28FindID_293350%29.jpg',
          replies: Array<any>()
        }
      ]
    },
    {
      discussionId: '1',
      postId: '4',
      author: { userName: 'user2', userAvatarURI: 'https://picsum.photos/id/690/200/300' },
      postedDate: '2019-01-01T02:01:00',
      imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Barragga_Bay_-_panoramio.jpg',
      replies: Array<any>()
    }
  ]
};

const DATA: DiscussionPost[] = [
  {
    discussionId: '1',
    postId: '1',
    postedDate: new Date().toUTCString(),
    author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
    imageSrc: getRandDogUrl(),
    commentCount: 5,
    replies: [
      {
        discussionId: '1',
        postId: '11',
        postedDate: new Date().toUTCString(),
        author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
        imageSrc: getRandDogUrl(),
        commentCount: 3,
        replies: [
          {
            discussionId: '11',
            postId: '111',
            postedDate: new Date().toUTCString(),
            author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
            imageSrc: getRandDogUrl(),
            commentCount: 3,
            replies: [
              {
                discussionId: '111',
                postId: '1111',
                postedDate: new Date().toUTCString(),
                author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
                imageSrc: getRandDogUrl(),
                replies: [],
                commentCount: 0
              },
              {
                discussionId: '11',
                postId: '1112',
                postedDate: new Date().toUTCString(),
                author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
                imageSrc: getRandDogUrl(),
                replies: [],
                commentCount: 0
              },
              {
                discussionId: '11',
                postId: '1113',
                postedDate: new Date().toUTCString(),
                author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
                imageSrc: getRandDogUrl(),
                replies: [],
                commentCount: 0
              }
            ]
          },
          {
            discussionId: '11',
            postId: '112',
            postedDate: new Date().toUTCString(),
            author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
            imageSrc: getRandDogUrl(),
            replies: [],
            commentCount: 0
          },
          {
            discussionId: '11',
            postId: '113',
            postedDate: new Date().toUTCString(),
            author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
            imageSrc: getRandDogUrl(),
            replies: [],
            commentCount: 0
          }
        ]
      },
      {
        discussionId: '1',
        postId: '12',
        postedDate: new Date().toUTCString(),
        author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
        imageSrc: getRandDogUrl(),
        replies: [],
        commentCount: 0
      },
      {
        discussionId: '1',
        postId: '13',
        postedDate: new Date().toUTCString(),
        author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
        imageSrc: getRandDogUrl(),
        replies: [],
        commentCount: 0
      },
      {
        discussionId: '1',
        postId: '14',
        postedDate: new Date().toUTCString(),
        author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
        imageSrc: getRandDogUrl(),
        replies: [],
        commentCount: 0
      },
      {
        discussionId: '1',
        postId: '15',
        postedDate: new Date().toUTCString(),
        author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
        imageSrc: getRandDogUrl(),
        replies: [],
        commentCount: 0
      }
    ]
  },
  {
    discussionId: '2',
    postId: '2',
    postedDate: new Date().toUTCString(),
    author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
    imageSrc: getRandDogUrl(),
    replies: [],
    commentCount: 0
  },
  {
    discussionId: '3',
    postId: '3',
    postedDate: new Date().toUTCString(),
    author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
    imageSrc: getRandDogUrl(),
    replies: [],
    commentCount: 0
  },
  {
    discussionId: '4',
    postId: '4',
    postedDate: new Date().toUTCString(),
    author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
    imageSrc: getRandDogUrl(),
    replies: [],
    commentCount: 0
  },
  {
    discussionId: '5',
    postId: '5',
    postedDate: new Date().toUTCString(),
    author: { userName: 'Dosss', userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png' },
    imageSrc: getRandDogUrl(),
    replies: [],
    commentCount: 0
  }
];

/**
 * Responsible for retreiving Discussion data from the API
 * NOTE: This currently just a stub that returns static data
 */
export class DiscussionService {
  getDiscussion(postId: string): Promise<DiscussionPost> {
    let discussions = DATA;
    const discussion = discussions.find(d => d.postId === postId);
    console.log(discussion);
    return Promise.resolve(discussion);
  }

  getRootDiscussionPosts(): Promise<DiscussionPost[]> {
    let discussions = DATA;
    return Promise.resolve(discussions);
  }
}

export default new DiscussionService();
