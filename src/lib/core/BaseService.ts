import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { BaseRepository } from './BaseRepository';
import { FilterBuilder } from './FilterBuilder';
import { FindOptions, ID, OrderDirection } from './IBaseRepository';

export abstract class BaseService<
  TTable extends PgTable & { id: PgColumn },
  TRepository extends BaseRepository<TTable> = BaseRepository<TTable>,
> {
  constructor(protected readonly repository: TRepository) {}

  async findAll(options?: FindOptions) {
    try {
      const filter = options?.where
        ? FilterBuilder.build(options?.where)
        : undefined;

      return await this.repository.findAll({
        where: filter,
        limit: options?.limit ?? 10,
        offset: options?.offset ?? 0,
        orderBy: this.transformOrderBy(options?.orderBy),
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findById(id: ID) {
    try {
      const item = await this.repository.findById(id);
      if (!item) {
        throw new Error('Item not found');
      }
      return item;
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(data: TTable['$inferInsert']) {
    try {
      const item = await this.repository.create(data);
      return item;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: ID, data: Partial<TTable['$inferInsert']>) {
    try {
      const item = await this.repository.update(id, data);
      if (!item) {
        throw new Error('Item not found');
      }

      return item;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: ID) {
    try {
      await this.repository.delete(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkExists(id: ID) {
    try {
      const item = await this.repository.findById(id);
      return !!item;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Private method: complete later
  protected handleError(error: unknown): never {
    console.error('Error finding by id', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      typeof error === 'string' ? error : 'An unexpected error occurred',
    );
  }

  protected async catchError(callback: () => Promise<unknown>) {
    try {
      return await callback();
    } catch (error) {
      console.error('Error finding by id', error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        typeof error === 'string' ? error : 'An unexpected error occurred',
      );
    }
  }

  protected transformOrderBy(orderBy: FindOptions['orderBy']) {
    if (!orderBy) return undefined;
    const table = this.repository.getTable();

    return orderBy
      .filter((order) => order.column in table)
      .map((order) => ({
        column: table[order.column as keyof typeof table] as PgColumn,
        direction: order.direction as OrderDirection,
      }));
  }
}
