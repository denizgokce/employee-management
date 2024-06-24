export interface IWrite<T> {
  create(items: T): Promise<T>;
  update(id: string, items: T): Promise<T>;
  delete(id: string): Promise<void>;
}
