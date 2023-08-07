import { User } from "../users/user.entity";
export declare class Posts {
    id: number;
    title: string;
    content: string;
    author: User;
    rating: number;
}
