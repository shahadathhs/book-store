import { PaymentsTable } from '@/db/schemas';
import { BaseService } from '@/lib/core/BaseService';
import { PaymentsRepository } from '@/repository/payment.repository';
import { injectable } from 'tsyringe';

@injectable()
export class PaymentService extends BaseService<
  typeof PaymentsTable,
  PaymentsRepository
> {
  constructor(repository: PaymentsRepository) {
    super(repository);
  }
}
