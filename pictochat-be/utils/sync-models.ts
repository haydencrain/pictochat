import { DiscussionPost } from '../models/discussion-post';
import { DiscussionThread } from '../models/discussion-thread';
import { ChallengeRate } from '../models/challenge-rate';

export async function syncModels() {
  try {
    await DiscussionThread.sync({ force: true });
    await DiscussionPost.sync({ force: true });
    await ChallengeRate.sync({ force: true });
  } catch (error) {
    console.log('Error:', error);
  }
}
