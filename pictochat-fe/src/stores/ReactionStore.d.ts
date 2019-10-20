import { Reaction } from '../models/store/Reaction';
import ObservableIntMap from '../utils/ObserableIntMap';
interface IReactionStore {
    /**
     * Set to true if the store is currently fetching reactions
     */
    isLoading: boolean;
    /**
     * A 2D map of reactions, indexed by both the post and user
     */
    postUserReactionsMap: ObservableIntMap<ObservableIntMap<Reaction>>;
}
export declare class ReactionStore implements IReactionStore {
    isLoading: boolean;
    postUserReactionsMap: ObservableIntMap<ObservableIntMap<Reaction>>;
    /**
     * Loads a new set of reactions for the specified post
     * @function
     * @param postId - The post id to load the reactions for
     */
    fetchPostReactions(postId: number): Promise<void>;
    /**
     * Updates a reaction
     * @function
     * @param postId The id of the post that the reaction is currently on
     * @param userId The id of the user who created the reaction
     * @param reactionName The name of the reaction to update to
     */
    updateReaction(postId: number, userId: number, reactionName: string): Promise<void>;
    private removeLocalReaction;
    loadThreadReactions(discussionId: string): Promise<void>;
    putReact(react: Reaction): void;
    putInUserReactsMap(userReacts: any, react: any): void;
    userReactionForPost: (...args: any[]) => any;
    hasReacted: (...args: any[]) => any;
    postReactionNameCounts: (...args: any[]) => any;
    /**
     * Get an array of Reaction objects for specified post
     * @function
     * @param postId The id of the post to get the reactions for
     */
    postReactions: (...args: any[]) => any;
}
export {};
