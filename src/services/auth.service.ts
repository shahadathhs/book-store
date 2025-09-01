import { NewUser } from '@/db/schemas';
import { HandleError } from '@/lib/decorator';
import { Email } from '@/lib/Email';
import { errorResponse, successResponse } from '@/lib/utils/response.util';
import { UserRepository } from '@/repository/user.repository';
import { UserService } from '@/services/user.service';
import bcrypt from 'bcryptjs';
import { container, injectable } from 'tsyringe';
import { OtpService } from './otp.service';

@injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {}

  @HandleError('User registration failed')
  async register(data: NewUser) {
    const { email, password, name } = data;

    const hashedPassword = await this.hashPassword(password);

    const result = await this.userService.create({
      email,
      password: hashedPassword,
      name,
    });

    await this.sendOtp(result.data.id, email);

    return result;
  }

  @HandleError('Failed to request OTP')
  async requestOtp(email: string, password: string) {
    const user = await this.getUserByUserEmail(email);
    if (user) {
      const isPasswordValid = await this.comparePassword(
        password,
        user.password,
      );
      if (isPasswordValid) {
        await this.sendOtp(user.id, email);

        return successResponse(null, 'OTP sent successfully');
      }

      return errorResponse(null, 'Invalid password');
    }

    return errorResponse(null, 'User not found');
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

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

  private async sendOtp(userId: string, email: string) {
    const data = await this.otpWithExpiry(userId);

    const item = await this.otpService.create(data);

    const emailService = container.resolve(Email);

    await emailService.sendLoginOtp(email, item.data.code);
  }

  private async getUserByUserEmail(email: string) {
    const repo = container.resolve(UserRepository);
    const user = await repo.findByEmail(email);

    return user;
  }
}
