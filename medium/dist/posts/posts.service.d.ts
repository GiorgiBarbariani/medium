import { CreatePostDto } from "./dto/create-post.dto";
import { Posts } from "./post.entity";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
interface PostWithReadingTime extends Posts {
    readingTime: number;
}
export declare class PostsService {
    private postRepository;
    private usersService;
    constructor(postRepository: Repository<Posts>, usersService: UsersService);
    createPost(createPostDto: CreatePostDto): Promise<Posts>;
    calculateReadingTime(content: string): number;
    getPostById(id: number): Promise<PostWithReadingTime>;
    getPosts(limit: number, offset: number): Promise<Posts[]>;
    getPostsByUserId(userId: number, limit: number, offset: number): Promise<Posts[]>;
    updateRating(id: number, newRating: number): Promise<Posts>;
    updatePostRating(id: number, newRating: number): Promise<Posts>;
}
export {};
