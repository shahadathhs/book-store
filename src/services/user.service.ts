import { UsersTable } from '@/db/schemas';
import { BaseService } from '@/lib/core/BaseService';
import { Email } from '@/lib/Email';
import { Logger } from '@/lib/Logger';
import { UserRepository } from '@/repository/user.repository';
import { injectable } from 'tsyringe';

@injectable()
export class UserService extends BaseService<
  typeof UsersTable,
  UserRepository
> {
  constructor(
    readonly repository: UserRepository,
    private readonly email: Email,
    private readonly logger: Logger,
  ) {
    super(repository);
  }

  async getUserByIdRaw(id: string) {
    return this.repository.findById(id);
  }
}
