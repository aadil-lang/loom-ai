import { Document } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: Record<string, unknown>): Promise<T | null>;
  findAll(filter?: Record<string, unknown>, limit?: number, skip?: number): Promise<T[]>;
  update(id: string, data: Record<string, unknown>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
