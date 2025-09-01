import { OtpTable } from '@/db/schemas';
import { BaseService } from '@/lib/core/BaseService';
import { OtpRepository } from '@/repository/otp.repository';
import { injectable } from 'tsyringe';

@injectable()
export class OtpService extends BaseService<typeof OtpTable, OtpRepository> {
  constructor(repository: OtpRepository) {
    super(repository);
  }
}
