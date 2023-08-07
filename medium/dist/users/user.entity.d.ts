import { Posts } from '../posts/post.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    rating: number;
    posts: Posts[];
}
