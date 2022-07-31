import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response, response } from 'express';
import { CurrentUser } from 'src/current-user.decorator';
import { UserResponse } from 'src/users/dto/response/user-response.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserResponse,
    @Res({passthrough: true}) response: Response,
  ): Promise<void> {
    await this.authService.login(user, response);
    response.send(user);
  }
}
