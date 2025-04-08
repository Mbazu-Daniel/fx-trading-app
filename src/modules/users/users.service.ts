import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async create(data: CreateUserDto) {
    return this.userRepository.create(data);
  }

  async update(id: string, data: Partial<User>) {
    return this.userRepository.update(id, data);
  }
}
