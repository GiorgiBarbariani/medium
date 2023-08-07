import { UsersService } from './users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    signUp(authCredentialsDto: AuthCredentialsDto): Promise<import("./user.entity").User>;
    signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
    }>;
    getUsers(limit: number, offset: number): Promise<import("./user.entity").User[]>;
    getUserRating(id: number): Promise<any>;
}
