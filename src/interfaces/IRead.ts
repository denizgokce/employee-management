import { FindOptionsWhere } from 'typeorm';

export interface IRead<T> {
  count(): Promise<number>;
  query(query: FindOptionsWhere<T>): Promise<T[]>;
  findOne(id: string): Promise<T>;
  findAll(): Promise<T[]>;
  isExist(id: string): Promise<boolean>;
}
