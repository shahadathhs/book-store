import { Controller } from '@/lib/decorator';
import { UserService } from '@/services/user.service';
import { injectable } from 'tsyringe';

@injectable()
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}
}
