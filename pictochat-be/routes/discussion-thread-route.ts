import express from 'express';
import { DiscussionService } from '../services/discussion-service';
import { ImageService } from '../services/image-service';
import { DiscussionTreeNode } from '../models/discussion-tree-node';

export const discussionPostRouter = express.Router();

discussionPostRouter.get('/', async (req, res, next) => {
  try {
    let threadSummaries = await DiscussionService.getThreadSummaries();
    let threadSummariesFlat = threadSummaries.map((threadSummary) => threadSummary.toFlatJSON());
    res.json(threadSummariesFlat);
  } catch (error) {
    next(error);
  }
  //res.send(DISCUSSIONS);
});

discussionPostRouter.get('/:discussionId', async (req, res, next) => {
  try {
    let replyTree: DiscussionTreeNode = await DiscussionService.getReplyTreeForThread(req.params.discussionId);
    res.json(replyTree.toJSON());
  } catch (error) {
    next(error);
  }
  // const discussion = DISCUSSIONS.find(d => d.discussionId === req.params.discussionId);
  // res.send(discussion);
});

const getRandDogUrl = () => `https://placedog.net/600?random&id=${Math.floor(Math.random() * 20) + 1}`;

const DISCUSSIONS = [
  {
    discussionId: '1',
    postId: '1',
    postedDate: new Date().toUTCString(),
    author: {
      userName: 'Dosss',
      userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
    },
    imageSrc: getRandDogUrl(),
    commentCount: 5,
    replies: [
      {
        discussionId: '1',
        postId: '11',
        postedDate: new Date().toUTCString(),
        author: {
          userName: 'Dosss',
          userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
        },
        imageSrc: getRandDogUrl(),
        commentCount: 3,
        replies: [
          {
            discussionId: '11',
            postId: '111',
            postedDate: new Date().toUTCString(),
            author: {
              userName: 'Dosss',
              userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
            },
            imageSrc: getRandDogUrl(),
            commentCount: 3,
            replies: [
              {
                discussionId: '111',
                postId: '1111',
                postedDate: new Date().toUTCString(),
                author: {
                  userName: 'Dosss',
                  userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
                },
                imageSrc: getRandDogUrl(),
                replies: [],
                commentCount: 0
              },
              {
                discussionId: '11',
                postId: '1112',
                postedDate: new Date().toUTCString(),
                author: {
                  userName: 'Dosss',
                  userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
                },
                imageSrc: getRandDogUrl(),
                replies: [],
                commentCount: 0
              },
              {
                discussionId: '11',
                postId: '1113',
                postedDate: new Date().toUTCString(),
                author: {
                  userName: 'Dosss',
                  userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
                },
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
            author: {
              userName: 'Dosss',
              userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
            },
            imageSrc: getRandDogUrl(),
            replies: [],
            commentCount: 0
          },
          {
            discussionId: '11',
            postId: '113',
            postedDate: new Date().toUTCString(),
            author: {
              userName: 'Dosss',
              userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
            },
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
        author: {
          userName: 'Dosss',
          userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
        },
        imageSrc: getRandDogUrl(),
        replies: [],
        commentCount: 0
      },
      {
        discussionId: '1',
        postId: '13',
        postedDate: new Date().toUTCString(),
        author: {
          userName: 'Dosss',
          userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
        },
        imageSrc: getRandDogUrl(),
        replies: [],
        commentCount: 0
      },
      {
        discussionId: '1',
        postId: '14',
        postedDate: new Date().toUTCString(),
        author: {
          userName: 'Dosss',
          userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
        },
        imageSrc: getRandDogUrl(),
        replies: [],
        commentCount: 0
      },
      {
        discussionId: '1',
        postId: '15',
        postedDate: new Date().toUTCString(),
        author: {
          userName: 'Dosss',
          userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
        },
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
    author: {
      userName: 'Dosss',
      userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
    },
    imageSrc: getRandDogUrl(),
    replies: [],
    commentCount: 0
  },
  {
    discussionId: '3',
    postId: '3',
    postedDate: new Date().toUTCString(),
    author: {
      userName: 'Dosss',
      userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
    },
    imageSrc: getRandDogUrl(),
    replies: [],
    commentCount: 0
  },
  {
    discussionId: '4',
    postId: '4',
    postedDate: new Date().toUTCString(),
    author: {
      userName: 'Dosss',
      userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
    },
    imageSrc: getRandDogUrl(),
    replies: [],
    commentCount: 0
  },
  {
    discussionId: '5',
    postId: '5',
    postedDate: new Date().toUTCString(),
    author: {
      userName: 'Dosss',
      userAvatarURI: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
    },
    imageSrc: getRandDogUrl(),
    replies: [],
    commentCount: 0
  }
];
