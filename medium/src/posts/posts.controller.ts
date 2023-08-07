import {Body, Controller, Get, Param, Patch, Post, Query} from "@nestjs/common";
import {PostsService} from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { Posts } from "./post.entity";

interface PostWithReadingTime extends Posts {
  readingTime: number;
}

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createTask(@Body() createTaskDto: CreatePostDto) {
    return this.postsService.createPost(createTaskDto);
  }

  @Get(":id")
  getPostById(@Param("id") id: number): Promise<PostWithReadingTime> {
    return this.postsService.getPostById(id);
  }

  @Get()
  getPosts(@Query("limit") limit: number, @Query("offset") offset: number) {
    return this.postsService.getPosts(limit, offset);
  }

  @Get("user/:userId")
  getPostsByUserId(
    @Param("userId") userId: number,
    @Query("limit") limit: number,
    @Query("offset") offset: number
  ) {
    return this.postsService.getPostsByUserId(userId, limit, offset);
  }

  @Patch(":id/rating")
  updateRating(@Param("id") id: number, @Body("rating") rating: number) {
    return this.postsService.updateRating(id, rating);
  }
}
