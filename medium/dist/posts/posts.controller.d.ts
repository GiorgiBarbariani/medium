import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { Posts } from "./post.entity";
interface PostWithReadingTime extends Posts {
    readingTime: number;
}
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    createTask(createTaskDto: CreatePostDto): Promise<Posts>;
    getPostById(id: number): Promise<PostWithReadingTime>;
    getPosts(limit: number, offset: number): Promise<Posts[]>;
    getPostsByUserId(userId: number, limit: number, offset: number): Promise<Posts[]>;
    updateRating(id: number, rating: number): Promise<Posts>;
}
export {};
