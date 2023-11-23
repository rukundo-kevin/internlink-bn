import { Controller, Body, Post } from '@nestjs/common';
import { addOrgDto, loginDto, registerDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/guard/guard.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  async register(@Body() registerInputDto: registerDto) {
    const user = await this.authService.register(registerInputDto);

    return user;
  }

  @Post('/add-org')
  async addOrg(@Body() data: addOrgDto) {
    const user = await this.authService.addOrg(data);
    return user;
  }

  @Post('/login')
  async login(@Body() loginInputDto: loginDto) {
    const { user, tokens } =
      await this.authService.loginWithUsernameOrPassword(loginInputDto);
    return {
      user,
      tokens,
    };
  }

  @Post('/activate')
  async activate(@Body() data: any) {
    const user = await this.authService.activateAccount(data.token);
    return user;
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() data: { email: string }) {
    const user = await this.authService.forgotPassword(data.email);
    return user;
  }

  @Post('/reset-password')
  async resetPassword(@Body() data: { token: string; password: string }) {
    const user = await this.authService.resetPassword(
      data.token,
      data.password,
    );
    return user;
  }
}
