import { OrderItemsTable } from '@/db/schemas';
import { BaseRepository } from '@/lib/core/BaseRepository';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';
import { inject, injectable } from 'tsyringe';

@injectable()
export class OrderItemRepository extends BaseRepository<
  typeof OrderItemsTable
> {
  constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
    super(db, OrderItemsTable);
  }
}
