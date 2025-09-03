import { NewUser, OtpPurpose } from '@/db/schemas';
import { Email } from '@/lib/Email';
import { ConfigEnum } from '@/lib/enum/config.enum';
import { JWTPayload } from '@/lib/middleware/auth.middleware';
import { errorResponse, successResponse } from '@/lib/utils/response.util';
import { UserRepository } from '@/repository/user.repository';
import { UserService } from '@/services/user.service';
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';
import { container, injectable } from 'tsyringe';
import { OtpService } from './otp.service';

@injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {}

  async register(data: NewUser) {
    const { email, password, name } = data;

    const hashedPassword = await this.hashPassword(password);

    const result = await this.userService.create({
      email,
      password: hashedPassword,
      name,
    });

    await this.sendOtp({
      userId: result.data.id,
      email,
      purpose: 'LOGIN_VERIFICATION',
    });

    return result;
  }

  async requestOtp(email: string, password: string) {
    const user = await this.getUserByUserEmail(email);
    if (user) {
      const isPasswordValid = await this.comparePassword(
        password,
        user.password,
      );
      if (isPasswordValid) {
        await this.sendOtp({
          userId: user.id,
          email,
          purpose: 'LOGIN_VERIFICATION',
        });

        return successResponse(null, 'OTP sent successfully');
      }

      return errorResponse(null, 'Invalid password');
    }

    return errorResponse(null, 'User not found');
  }

  async verifyOtp(email: string, code: string) {
    const user = await this.getUserByUserEmail(email);
    if (user) {
      const isValidOtp = await this.otpService.verifyOtp({
        userId: user.id,
        code,
        purpose: 'LOGIN_VERIFICATION',
      });
      if (isValidOtp) {
        const tokens = await this.generateTokens({
          sub: user.id,
          email: user.email,
          role: user.role as JWTPayload['role'],
        });

        return successResponse(
          {
            tokens,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
          },
          'OTP verified successfully',
        );
      }

      return errorResponse(null, 'Invalid OTP');
    }

    return errorResponse(null, 'User not found');
  }

  async forgetPassword(email: string) {
    const user = await this.getUserByUserEmail(email);
    if (user) {
      await this.sendOtp({
        userId: user.id,
        email,
        purpose: 'PASSWORD_RESET',
      });
      return successResponse(null, 'OTP sent successfully');
    }

    return errorResponse(null, 'User not found');
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.getUserByUserEmail(email);
    if (user) {
      const isValidOtp = await this.otpService.verifyOtp({
        userId: user.id,
        code,
        purpose: 'PASSWORD_RESET',
      });
      if (isValidOtp) {
        const hashedPassword = await this.hashPassword(newPassword);
        await this.userService.update(user.id, { password: hashedPassword });
        return successResponse(null, 'Password reset successfully');
      }

      return errorResponse(null, 'Invalid OTP');
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

  private async otpWithExpiry(userId: string, purpose: OtpPurpose) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    return {
      code: otp.toString(),
      expiresAt: otpExpiry,
      purpose,
      userId,
    };
  }

  private async sendOtp({
    userId,
    email,
    purpose,
  }: {
    userId: string;
    email: string;
    purpose: OtpPurpose;
  }) {
    const data = await this.otpWithExpiry(userId, purpose);

    const item = await this.otpService.create(data);

    const emailService = container.resolve(Email);

    await emailService.sendLoginOtp(email, item.data.code);
  }

  private async getUserByUserEmail(email: string) {
    const repo = container.resolve(UserRepository);
    const user = await repo.findByEmail(email);

    return user;
  }

  private signToken(payload: object, secret: string, options: object) {
    return jwt.sign(payload, secret, options);
  }

  private async generateTokens(payload: JWTPayload) {
    const accessToken = this.signToken(
      payload,
      config.get(ConfigEnum.JWT_SECRET),
      {
        expiresIn: '2d',
      },
    );

    const refreshToken = this.signToken(
      payload,
      config.get(ConfigEnum.JWT_SECRET),
      {
        expiresIn: '90d',
      },
    );

    return { accessToken, refreshToken };
  }
}
