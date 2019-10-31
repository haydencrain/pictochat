import path from 'path';

export const TEST_DATA_DIRECTORY = path.resolve(__dirname, '../../test-data');
export const TEST_IMAGE_PATH = path.join(TEST_DATA_DIRECTORY, 'green.JPG');

// Test data to symantic role mappings
export const NO_REPLY_POST_ID = '15'; // post in test data with on replies
export const ONE_REPLY_TEST_ROOT_POST_ID = '13';
export const ONE_REPLY_TEST_REPLY_POST_ID = '16';
export const ONE_REACTION_POST_ID = '15';
export const NO_REPLIES_OR_REACTIONS_TEST_POST_ID = '17';

// Token for 'testuser1' user with JWT signing secret 'pictochat-jwt'
export const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTcyNDkzNjM3LCJleHAiOjE1NzI1ODAwMzd9.UNvs2qYKcydTgt7fImdwDA0GRLofYWyW3WsbHEWnkFk';
