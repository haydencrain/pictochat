import { Reaction, IReaction } from '../models/store/Reaction';
/**
 * Implements HTTP Requests for the `'/reaction'` API endpoint
 * @class
 * @static
 */
declare class ReactionService {
    static getDiscussionReactions(discussionId: string): Promise<IReaction[]>;
    static getReactions(postId: number, userId: number): Promise<Reaction[]>;
    static getReactionsPost(postId: number): Promise<Reaction[]>;
    static getReactionsUser(userId: number): Promise<Reaction[]>;
    static addReaction(reactionName: string, postId: number, userId: number): Promise<Reaction>;
    static removeReaction(reactionId: number): Promise<void>;
}
export default ReactionService;
