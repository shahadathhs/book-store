import { AdminLogsTable } from '@/db/schemas';
import { BaseService } from '@/lib/core/BaseService';
import { AdminLogsRepository } from '@/repository/admin-log.repository';
import { injectable } from 'tsyringe';

@injectable()
export class AdminLogsService extends BaseService<
  typeof AdminLogsTable,
  AdminLogsRepository
> {
  constructor(repository: AdminLogsRepository) {
    super(repository);
  }
}
