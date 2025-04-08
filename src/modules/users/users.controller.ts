import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { JwtAuthGuard, RoleGuard, Roles } from 'src/common/guards';
import { IAuthenticatedUserRequest } from 'src/common/interfaces';
import { IUserResponseDto, UserMapper } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(
    @CurrentUser() req: IAuthenticatedUserRequest,
  ): Promise<IUserResponseDto | null> {
    console.log('req.auth.principalId', req.auth.principalId);
    const user = await this.usersService.getProfile(req.auth.principalId);

    if (!user) return null;

    const userResponse: IUserResponseDto = UserMapper.toResponse(user);

    return userResponse;
  }

  @Delete('account')
  async deleteAccount(
    @CurrentUser() req: IAuthenticatedUserRequest,
  ): Promise<{ message: string }> {
    await this.usersService.deleteAccount(req.auth.principalId);

    return { message: 'Account deleted successfully' };
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  @Roles(UserRole.SUPER_ADMIN)
  async getAllUsers(): Promise<IUserResponseDto[]> {
    const users = await this.usersService.getAllUsers();

    const userResponse: IUserResponseDto[] = UserMapper.toResponseList(users);

    return userResponse;
  }

  @Get(':userId')
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN)
  @Roles(UserRole.SUPER_ADMIN)
  async getUserById(
    @Param('userId') userId: string,
  ): Promise<IUserResponseDto> {
    const user = await this.usersService.getUserById(userId);

    const userResponse: IUserResponseDto = UserMapper.toResponse(user);

    return userResponse;
  }
}
