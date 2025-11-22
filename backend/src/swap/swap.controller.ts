import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SwapService } from './swap.service';
import { AuthGuard } from '@nestjs/passport';
import { SwapQuoteDto, SwapExecuteDto } from './dto/swap.dto';

@Controller('api/swap')
export class SwapController {
  constructor(private swapService: SwapService) { }

  @Post('quote')
  async getQuote(@Body() dto: SwapQuoteDto) {
    return this.swapService.getQuote(
      dto.fromToken,
      dto.toToken,
      dto.fromAmount,
      dto.chainId,
      dto.slippage || 0.5,
    );
  }

  @Post('execute')
  async executeSwap(@Body() dto: SwapExecuteDto, @Req() req: any) {
    // First get the quote
    const quote = await this.swapService.getQuote(
      dto.fromToken,
      dto.toToken,
      dto.fromAmount,
      dto.chainId,
      dto.slippage || 0.5,
    );

    // Get user's wallet address
    const walletAddress = dto.walletAddress;

    // Prepare transaction for signing
    return this.swapService.executeSwap(quote, walletAddress, dto.chainId);
  }
}

