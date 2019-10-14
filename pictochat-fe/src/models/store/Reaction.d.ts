export interface IReaction {
    /**
     * The id of the reaction
     */
    reactionId: number;
    /**
     * the name of the reaction (aka reaction type)
     */
    reactionName: string;
    /**
     * the id of the post it was added to
     */
    postId: number;
    /**
     * the id of the user who created the reaction
     */
    userId: number;
}
/**
 * Creates an observable instance of Reaction.
 * @class
 */
export declare class Reaction implements IReaction {
    reactionId: number;
    reactionName: string;
    postId: number;
    userId: number;
    constructor(data?: IReaction);
    /**
     * Replaces the current instance of reaction with another instance
     * @param { Reaction } other - The other instance to replace this Reaction with
     */
    replace(other: Reaction): void;
    /**
     * Replaces this instance's post with an empty reaction
     * @function
     */
    clear(): void;
}
export default Reaction;
