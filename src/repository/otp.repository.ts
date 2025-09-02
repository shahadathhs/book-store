import { OtpTable } from '@/db/schemas';
import { BaseRepository } from '@/lib/core/BaseRepository';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'tsyringe';

@injectable()
export class OtpRepository extends BaseRepository<typeof OtpTable> {
  constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
    super(db, OtpTable);
  }

  async getOtpByIdAndCode(userId: string, code: string) {
    return this.db.executeQuery('get-otp-by-id-code', async (client) => {
      // 1. Find OTP by user + code
      const [otp] = await client
        .select()
        .from(OtpTable)
        .where(and(eq(OtpTable.userId, userId), eq(OtpTable.code, code)))
        .limit(1);

      return otp;
    });
  }

  async markOtpAsUsed(otpId: string) {
    return this.db.executeQuery('mark-otp-as-used', async (client) => {
      await client
        .update(OtpTable)
        .set({ used: true, updatedAt: new Date() })
        .where(eq(OtpTable.id, otpId));
    });
  }
}
