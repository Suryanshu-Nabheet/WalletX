import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { SendTransactionDto } from './dto/transaction.dto';

@Controller('api/tx')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get('balances')
  async getBalance(
    @Query('address') address: string,
    @Query('chainId') chainId: number,
  ) {
    return this.transactionsService.getBalance(address, Number(chainId));
  }

  @Get('token-balances')
  async getTokenBalances(
    @Query('address') address: string,
    @Query('chainId') chainId: number,
  ) {
    return this.transactionsService.getTokenBalances(address, Number(chainId));
  }

  @Get('history')
  async getTransactionHistory(
    @Query('address') address: string,
    @Query('chainId') chainId: number,
    @Query('limit') limit?: number,
  ) {
    return this.transactionsService.getTransactionHistory(
      address,
      Number(chainId),
      limit ? Number(limit) : 50,
    );
  }

  @Post('estimate-gas')
  async estimateGas(@Body() transaction: any, @Query('chainId') chainId: number) {
    return this.transactionsService.estimateGas(transaction, Number(chainId));
  }

  @Post('send')
  async sendTransaction(
    @Body() dto: SendTransactionDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    const ip = req.ip || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];

    return this.transactionsService.sendTransaction(
      userId,
      dto.walletId,
      dto.transaction,
      dto.chainId,
      dto.signedTx,
      ip,
      userAgent,
    );
  }

  @Get('status/:txHash')
  async getTransactionStatus(
    @Param('txHash') txHash: string,
    @Query('chainId') chainId: number,
  ) {
    return this.transactionsService.getTransactionStatus(txHash, Number(chainId));
  }
}

