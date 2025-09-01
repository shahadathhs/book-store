import { Controller, Post } from '@/lib/decorator';
import { UserService } from '@/services/user.service';
import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { OtpService } from './../services/otp.service';

@injectable()
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {}

  @Post('/register')
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;

    const result = await this.userService.create({
      email,
      password,
      name,
    });

    await this.otpService.sendOtp(result.data.id, email);

    res.status(200).json(result);
  }

  // @Post('/login')
  // async login(req: Request, res: Response) {
  //   const { email, password } = req.body;
  //   const result = await this.userService.login(email, password);
  //   res.status(200).json(result);
  // }
}
