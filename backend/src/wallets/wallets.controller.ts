import { Controller, Get, Param } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Controller('api/wallet')
export class WalletsController {
  constructor(private walletsService: WalletsService) { }

  @Get('balance/:chain/:address')
  async getBalance(
    @Param('chain') chain: string,
    @Param('address') address: string,
  ) {
    return this.walletsService.getBalance(chain, address);
  }

  @Get('history/:chain/:address')
  async getHistory(
    @Param('chain') chain: string,
    @Param('address') address: string,
  ) {
    return this.walletsService.getHistory(chain, address);
  }
}

