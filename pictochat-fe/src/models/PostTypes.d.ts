export declare enum PostTypes {
    Root = 0,
    Main = 1,
    Reply = 2
}
/**
 * Converts a PostType enum value into its string counterpart
 * @function
 * @param { enum } postType - The enum to convert
 * @returns The string representative of the post type `'main' | 'root' | 'reply' | ''`
 */
export declare function getPostTypeName(postType: PostTypes): "" | "main" | "root" | "reply";
