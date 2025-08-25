import { PaymentsTable } from '@/db/schemas/payment';
import { BaseRepository } from '@/lib/core/BaseRepository';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PaymentsRepository extends BaseRepository<typeof PaymentsTable> {
  constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
    super(db, PaymentsTable);
  }
}
