export interface IPostAuthor {
    /**
     * The author's username
     */
    username: string;
    /**
     * the URI of the user's avatar
     */
    userAvatarURI: string;
}
/**
 * Creates an observable instance of Post Author
 * @class
 */
export declare class PostAuthor implements IPostAuthor {
    username: string;
    userAvatarURI: string;
    constructor(data: IPostAuthor);
}
