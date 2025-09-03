import { OtpPurpose, OtpTable } from '@/db/schemas';
import { BaseService } from '@/lib/core/BaseService';
import { OtpRepository } from '@/repository/otp.repository';
import { injectable } from 'tsyringe';

@injectable()
export class OtpService extends BaseService<typeof OtpTable, OtpRepository> {
  constructor(repository: OtpRepository) {
    super(repository);
  }

  // Helper to verify OTP
  async verifyOtp({
    userId,
    code,
    purpose,
  }: {
    userId: string;
    code: string;
    purpose: OtpPurpose;
  }) {
    const otp = await this.repository.getOtpByIdAndCode(userId, code);

    if (!otp) {
      throw new Error('Invalid OTP');
    }

    // 2. Check if already used
    if (otp.used) {
      throw new Error('OTP already used');
    }

    // 3. Check if expired
    if (otp.expiresAt < new Date()) {
      throw new Error('OTP expired');
    }

    // 4. Check if purpose matches
    if (otp.purpose !== purpose) {
      throw new Error('Invalid OTP purpose');
    }

    // 5. Mark as used
    await this.repository.markOtpAsUsed(otp.id);

    return otp;
  }
}
