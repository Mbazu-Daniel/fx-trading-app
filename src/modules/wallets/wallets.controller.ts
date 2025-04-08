import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { IAuthenticatedUserRequest } from 'src/common/interfaces';
import { WalletsService } from './wallets.service';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Get()
  async getUserWallets(@CurrentUser() req: IAuthenticatedUserRequest) {
    return this.walletService.getUserWallets(req.auth.principalId);
  }
}
