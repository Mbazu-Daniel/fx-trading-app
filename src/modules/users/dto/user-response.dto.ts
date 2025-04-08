import { User } from 'src/common/database/entities';
import { UserRole } from 'src/common/enums';

export interface IUserResponseDto {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  verifiedAt?: Date | null;
}

export class UserMapper {
  static toResponse(user: User): IUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      firstName: user.firstName,
      lastName: user.lastName,
      verifiedAt: user.verifiedAt,
    };
  }

  static toResponseList(users: User[]): IUserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}
