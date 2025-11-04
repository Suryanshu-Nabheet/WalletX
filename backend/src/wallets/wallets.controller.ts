import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateWalletDto, UpdateWalletDto } from './dto/wallet.dto';

@Controller('api/wallet')
@UseGuards(AuthGuard('jwt'))
export class WalletsController {
  constructor(private walletsService: WalletsService) {}

  @Post('create')
  async createWallet(@Body() dto: CreateWalletDto, @Req() req: any) {
    const userId = req.user.sub;
    const ip = req.ip || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];

    return this.walletsService.createWallet(
      userId,
      dto.chain,
      dto.mode,
      dto.encryptedBlob,
      dto.address,
      ip,
      userAgent,
    );
  }

  @Get()
  async getWallets(@Req() req: any) {
    const userId = req.user.sub;
    return this.walletsService.getWallets(userId);
  }

  @Get(':id')
  async getWallet(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.walletsService.getWallet(userId, id);
  }

  @Get(':id/export')
  async exportWallet(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.walletsService.exportWallet(userId, id);
  }

  @Put(':id')
  async updateWallet(
    @Param('id') id: string,
    @Body() dto: UpdateWalletDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.walletsService.updateWallet(userId, id, dto);
  }

  @Delete(':id')
  async deleteWallet(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.walletsService.deleteWallet(userId, id);
  }
}

