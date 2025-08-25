import { OrderItemsTable } from '@/db/schemas';
import { BaseService } from '@/lib/core/BaseService';
import { OrderItemRepository } from '@/repository/order-item.repository';
import { injectable } from 'tsyringe';

@injectable()
export class OrderItemsService extends BaseService<
  typeof OrderItemsTable,
  OrderItemRepository
> {
  constructor(repository: OrderItemRepository) {
    super(repository);
  }
}
