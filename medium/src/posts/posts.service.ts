import {Injectable} from "@nestjs/common";
import {User} from "src/users/user.entity";
import {CreatePostDto} from "./dto/create-post.dto";
import {Posts} from "./post.entity";
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";

interface PostWithReadingTime extends Posts {
  readingTime: number;
}


@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
    private usersService: UsersService
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const {title, content, authorId} = createPostDto;

    const author = await this.postRepository.findOne({where: {id: authorId}});

    if (!author) {
      throw new Error("Author not found");
    }

    const post = this.postRepository.create({
      title,
      content,
      author,
    });

    await this.postRepository.save(post);
    return post;
  }

  calculateReadingTime(content: string): number {
    const wordsPerMinute = 265; // Average reading speed
    const numberOfWords = content.split(" ").length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  }

  async getPostById(id: number): Promise<PostWithReadingTime> {
    const post = await this.postRepository.findOne({where: {id: id}});
    if (!post) {
      throw new Error(`Post with ID ${id} not found`);
    }
    const readingTime = this.calculateReadingTime(post.content);
    return {...post, readingTime};
  }

  async getPosts(limit: number, offset: number): Promise<Posts[]> {
    return await this.postRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async getPostsByUserId(
    userId: number,
    limit: number,
    offset: number
  ): Promise<Posts[]> {
    return await this.postRepository.find({
      where: {author: {id: userId}},
      take: limit,
      skip: offset,
    });
  }

  // Add to PostsService

  async updateRating(id: number, newRating: number): Promise<Posts> {
    const post = await this.postRepository.findOne({where: {id}});

    if (!post) {
      throw new Error("Post not found");
    }

    post.rating = newRating;
    await this.postRepository.save(post);

    return post;
  }

  async updatePostRating(id: number, newRating: number) {
    const post = await this.postRepository.findOne({where: {id}});
    post.rating = newRating;
    await this.postRepository.save(post);

    await this.usersService.calculateUserRating(post.id);

    return post;
  }
}
