import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from "bcrypt";
import { User } from './user.entity';
import { Repository, getManager } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    const {email, password} = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({email, password: hashedPassword});

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("Username already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{accessToken: string}> {
    const {email, password} = authCredentialsDto;
    const user = await this.usersRepository.findOne({where: {email}});

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = {email};
      const accessToken = this.jwtService.sign(payload);
      return {accessToken};
    } else {
      throw new UnauthorizedException("Please check your login credentials");
    }
  }

  async getUsers(limit: number, offset: number): Promise<User[]> {
    return await this.usersRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async calculateUserRating(id: number) {
    const entityManager = getManager();
    const userRating = await entityManager.query(
      `
      SELECT AVG(posts.rating) as rating
      FROM posts
      WHERE posts.userId = $1
    `,
      [id]
    );

    const user = await this.usersRepository.findOne({where: {id}});
    user.rating = userRating[0].rating;
    await this.usersRepository.save(user);

    return userRating;
  }
  
}
