export interface Entity<T, I> {
  findOne(id: I): Promise<T>;
  findAll(): Promise<T[]>;
  create(item: T): Promise<T>;
  update(item: T): Promise<T>;
  delete(id: I): Promise<void>;
}
