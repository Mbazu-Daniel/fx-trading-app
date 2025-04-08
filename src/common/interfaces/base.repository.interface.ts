import { DeepPartial } from 'typeorm';

export interface IBaseRepository<T> {
  findAll(includeDeleted?: boolean): Promise<T[]>;
  findById(id: string, includeDeleted?: boolean): Promise<T>;
  create(data: DeepPartial<T>): Promise<T>;
  update(id: string, data: DeepPartial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
}
