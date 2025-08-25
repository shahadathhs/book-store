import { OrdersTable } from '@/db/schemas';
import { BaseRepository } from '@/lib/core/BaseRepository';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';
import { inject, injectable } from 'tsyringe';

@injectable()
export class OrdersRepository extends BaseRepository<typeof OrdersTable> {
  constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
    super(db, OrdersTable);
  }
}
