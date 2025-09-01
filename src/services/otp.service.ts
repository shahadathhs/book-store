import { OtpTable } from '@/db/schemas';
import { BaseService } from '@/lib/core/BaseService';
import { HandleError } from '@/lib/decorator';
import { Email } from '@/lib/Email';
import { successResponse } from '@/lib/utils/response.util';
import { OtpRepository } from '@/repository/otp.repository';
import { container, injectable } from 'tsyringe';

@injectable()
export class OtpService extends BaseService<typeof OtpTable, OtpRepository> {
  constructor(repository: OtpRepository) {
    super(repository);
  }

  @HandleError('Failed to create otp')
  async sendOtp(userId: string, email: string) {
    const data = await this.otpWithExpiry(userId);

    const item = await this.repository.create(data);
    console.info('item', item);

    const emailService = container.resolve(Email);

    await emailService.sendLoginOtp(email, item.code);

    return successResponse(item, 'Item created successfully');
  }

  // * helper to generate 6 digit otp with five minutes expiry
  private async otpWithExpiry(userId: string) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const purpose = 'Login Verification';

    return {
      code: otp.toString(),
      expiresAt: otpExpiry,
      purpose,
      userId,
    };
  }
}
