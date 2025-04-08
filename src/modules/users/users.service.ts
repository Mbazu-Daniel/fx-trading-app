import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserDto) {
    return this.userRepository.create(data);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async getProfile(userId: string): Promise<User> {
    console.log('userId', userId);
    return this.userRepository.findById(userId);
  }

  async update(id: string, data: Partial<User>) {
    return this.userRepository.update(id, data);
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.userRepository.softDelete(userId);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }
}
