import { Controller, Post } from '@/lib/decorator';
import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { AuthService } from './../services/auth.service';

@injectable()
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;

    const result = await this.authService.register({
      email,
      password,
      name,
    });

    res.status(200).json(result);
  }

  @Post('/request-otp')
  async requestOtp(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await this.authService.requestOtp(email, password);

    res.status(200).json(result);
  }

  @Post('/verify-otp')
  async verifyOtp(req: Request, res: Response) {
    const { email, code } = req.body;

    const result = await this.authService.verifyOtp(email, code);

    res.status(200).json(result);
  }

  @Post('/forget-password')
  async forgetPassword(req: Request, res: Response) {
    const { email } = req.body;

    const result = await this.authService.forgetPassword(email);

    res.status(200).json(result);
  }

  @Post('/reset-password')
  async resetPassword(req: Request, res: Response) {
    const { email, code, newPassword } = req.body;

    const result = await this.authService.resetPassword(
      email,
      code,
      newPassword,
    );

    res.status(200).json(result);
  }
}
