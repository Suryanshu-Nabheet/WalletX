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
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) { }

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
  ) {
    return this.transactionsService.sendTransaction(
      dto.signedTx,
      dto.chainId,
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

