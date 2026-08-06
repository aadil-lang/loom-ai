import { Model, Document } from 'mongoose';
import { IBaseRepository } from '../interfaces/repositories/IBaseRepository';

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const createdDocument = new this.model(data);
    return await createdDocument.save();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).lean().exec() as T | null;
  }

  async findOne(filter: Record<string, unknown>): Promise<T | null> {
    return await this.model.findOne(filter).lean().exec() as T | null;
  }

  async findAll(filter: Record<string, unknown> = {}, limit = 0, skip = 0): Promise<T[]> {
    return await this.model.find(filter).limit(limit).skip(skip).lean().exec() as T[];
  }

  async update(id: string, data: Record<string, unknown>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
