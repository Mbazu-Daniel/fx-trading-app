import { NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { IBaseRepository } from '../interfaces/base.repository.interface';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(private readonly repository: Repository<T>) {}

  async findAll(
    includeDeleted: boolean = false,
    relations: string[] = [],
  ): Promise<T[]> {
    return this.repository.find({
      withDeleted: includeDeleted,
      relations,
    });
  }

  async findById(
    id: string,
    includeDeleted: boolean = false,
    relations: string[] = [],
  ): Promise<T> {
    const options: FindOneOptions = {
      where: { id },
      withDeleted: includeDeleted,
      relations,
    };

    return this.repository.findOne(options);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data as any);

    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.repository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
  }

  async restore(id: string): Promise<void> {
    const result = await this.repository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Entity with id ${id} not found or is not soft deleted`,
      );
    }
  }
}
