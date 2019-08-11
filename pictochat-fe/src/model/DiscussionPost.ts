import {PostAuthor} from './PostAuthor';

export interface DiscussionPost {
    discussionId: string;
    postId: string;
    postedDate: string;
    author: PostAuthor;
    imageSrc: string; // URI for the post's image
    replies: DiscussionPost[];
}

// export class DiscussionPost {
//     postedDate: Date;
//     discussionId: string;
//     author: PostAuthor;
//     imageSrc: string; // URI for the post's image
//     replies: DiscussionPost[];
    
//     constructor(postedDate: Date, discussionId: string, author: PostAuthor, imageSrc: string, 
//                 replies: DiscussionPost[]) {
//         this.postedDate = postedDate;
//         this.discussionId = discussionId;
//         this.author = author;
//         this.imageSrc = imageSrc;
//     }

//     /**
//      * @param obj JSON like object. All properties are assumed to be string or an object of string properties (for author).
//      *      Should have properties for each instance attribute.
//      */
//     static fromJSON(obj: any): DiscussionPost {
//         let replies = 
//         return new DiscussionPost(obj.postedDate, obj.discussionId, PostAuthor.fromJSON(obj.author), obj.imageSrc);
//     }
// }