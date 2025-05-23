import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';
import { AccessToken } from '../common/decorators/access-token.decorator';
import { ROUTES } from '../helpers/string-const';
import { IApiResponse } from '../helpers/response.helper';

@Controller(ROUTES.USERS)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUserInfo(
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.usersService.getUserInfo(userId, accessToken);
  }
} 