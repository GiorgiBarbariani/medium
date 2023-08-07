"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const post_entity_1 = require("./post.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
let PostsService = class PostsService {
    constructor(postRepository, usersService) {
        this.postRepository = postRepository;
        this.usersService = usersService;
    }
    async createPost(createPostDto) {
        const { title, content, authorId } = createPostDto;
        const author = await this.postRepository.findOne({ where: { id: authorId } });
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
    calculateReadingTime(content) {
        const wordsPerMinute = 265;
        const numberOfWords = content.split(" ").length;
        return Math.ceil(numberOfWords / wordsPerMinute);
    }
    async getPostById(id) {
        const post = await this.postRepository.findOne({ where: { id: id } });
        if (!post) {
            throw new Error(`Post with ID ${id} not found`);
        }
        const readingTime = this.calculateReadingTime(post.content);
        return Object.assign(Object.assign({}, post), { readingTime });
    }
    async getPosts(limit, offset) {
        return await this.postRepository.find({
            take: limit,
            skip: offset,
        });
    }
    async getPostsByUserId(userId, limit, offset) {
        return await this.postRepository.find({
            where: { author: { id: userId } },
            take: limit,
            skip: offset,
        });
    }
    async updateRating(id, newRating) {
        const post = await this.postRepository.findOne({ where: { id } });
        if (!post) {
            throw new Error("Post not found");
        }
        post.rating = newRating;
        await this.postRepository.save(post);
        return post;
    }
    async updatePostRating(id, newRating) {
        const post = await this.postRepository.findOne({ where: { id } });
        post.rating = newRating;
        await this.postRepository.save(post);
        await this.usersService.calculateUserRating(post.id);
        return post;
    }
};
PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Posts)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map