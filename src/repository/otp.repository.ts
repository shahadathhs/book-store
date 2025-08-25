import { OtpTable } from '@/db/schemas';
import { BaseRepository } from '@/lib/core/BaseRepository';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';
import { inject, injectable } from 'tsyringe';

@injectable()
export class OtpRepository extends BaseRepository<typeof OtpTable> {
  constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
    super(db, OtpTable);
  }
}
