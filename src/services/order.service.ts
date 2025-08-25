import { OrdersTable } from '@/db/schemas';
import { BaseService } from '@/lib/core/BaseService';
import { OrdersRepository } from '@/repository/order.repository';
import { injectable } from 'tsyringe';

@injectable()
export class OrdersService extends BaseService<
  typeof OrdersTable,
  OrdersRepository
> {
  constructor(repository: OrdersRepository) {
    super(repository);
  }
}
