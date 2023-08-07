import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/signup")
  signUp(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.usersService.signUp(authCredentialsDto);
  }

  @Post("/signin")
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto
  ): Promise<{accessToken: string}> {
    return this.usersService.signIn(authCredentialsDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  getUsers(@Query("limit") limit: number, @Query("offset") offset: number) {
    return this.usersService.getUsers(limit, offset);
  }

  @Get("/:id/rating")
  getUserRating(@Param("id") id: number) {
    return this.usersService.calculateUserRating(id);
  }
}
