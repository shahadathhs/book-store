import { UsersTable } from '@/db/schemas';
import { BaseService } from '@/lib/core/BaseService';
import { HandleError } from '@/lib/decorator';
import { Email } from '@/lib/Email';
import { Logger } from '@/lib/Logger';
import { errorResponse } from '@/lib/utils/response.util';
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

  @HandleError('Failed to reset password')
  async forgetPassword(userId: string) {
    const user = await this.repository.findById(userId);

    if (!user) {
      return errorResponse(null, 'User not found');
    }

    const token = `${user.id}-${user.email}-${user.password}`;

    await this.email.send(user.email, token);

    this.logger.log('Email sent to ' + user.email);
  }
}
