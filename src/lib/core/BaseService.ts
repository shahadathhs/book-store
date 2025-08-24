import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { HandleError } from '../decorator/error.decorator';
import { successResponse } from '../utils/response.util';
import { BaseRepository } from './BaseRepository';
import { FilterBuilder } from './FilterBuilder';
import { FindOptions, ID, OrderDirection } from './IBaseRepository';

export abstract class BaseService<
  TTable extends PgTable & { id: PgColumn },
  TRepository extends BaseRepository<TTable> = BaseRepository<TTable>,
> {
  constructor(protected readonly repository: TRepository) {}

  @HandleError()
  async findAll(options?: FindOptions) {
    const filter = options?.where
      ? FilterBuilder.build(options.where)
      : undefined;
    const result = await this.repository.findAll({
      where: filter,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
      orderBy: this.transformOrderBy(options?.orderBy),
    });

    return successResponse(result);
  }

  @HandleError('Item not found')
  async findById(id: ID) {
    const item = await this.repository.findById(id);
    if (!item) throw new Error('Item not found');

    return successResponse(item);
  }

  @HandleError()
  async create(data: TTable['$inferInsert']) {
    const item = await this.repository.create(data);
    return successResponse(item, 'Item created successfully');
  }

  @HandleError('Item not found')
  async update(id: ID, data: Partial<TTable['$inferInsert']>) {
    const item = await this.repository.update(id, data);
    if (!item) throw new Error('Item not found');

    return successResponse(item, 'Item updated successfully');
  }

  @HandleError()
  async delete(id: ID) {
    await this.repository.delete(id);
    return successResponse({ deleted: true }, 'Item deleted successfully');
  }

  @HandleError()
  async checkExists(id: ID) {
    const item = await this.repository.findById(id);
    return successResponse(!!item);
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
