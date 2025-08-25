import { AdminLogsTable } from '@/db/schemas';
import { BaseRepository } from '@/lib/core/BaseRepository';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AdminLogsRepository extends BaseRepository<typeof AdminLogsTable> {
  constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
    super(db, AdminLogsTable);
  }
}
