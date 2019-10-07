import { DiscussionPost } from '../models/discussion-post';
import { User } from '../models/user';
import { Image } from '../models/image';
import { Reaction } from '../models/reaction';
import { ReactionService } from '../services/reaction-service';

export async function syncModels() {
  try {
    // await DiscussionThread.sync({ force: true });
    await Image.sync({ force: true });
    await User.sync({ force: true });
    await DiscussionPost.sync({ force: true });
    await Reaction.sync({ force: true });
  } catch (error) {
    console.log('Error:', error);
  }
}
