import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ethers } from 'ethers';
import { CHAIN_CONFIGS } from '@walletx/shared';

@Injectable()
export class SwapService {
  private zeroXApiKey: string;
  private oneInchApiKey: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.zeroXApiKey = this.configService.get<string>('ZEROX_API_KEY', '');
    this.oneInchApiKey = this.configService.get<string>('ONEINCH_API_KEY', '');
  }

  async getQuote(
    fromToken: string,
    toToken: string,
    fromAmount: string,
    chainId: number,
    slippage: number = 0.5,
  ) {
    const config = CHAIN_CONFIGS[chainId];
    if (!config) {
      throw new BadRequestException('Unsupported chain');
    }

    // Try 0x API first
    if (this.zeroXApiKey) {
      try {
        return await this.getZeroXQuote(
          fromToken,
          toToken,
          fromAmount,
          chainId,
          slippage,
        );
      } catch (error) {
        console.error('0x API error:', error);
      }
    }

    // Fallback to 1inch
    if (this.oneInchApiKey) {
      try {
        return await this.getOneInchQuote(
          fromToken,
          toToken,
          fromAmount,
          chainId,
          slippage,
        );
      } catch (error) {
        console.error('1inch API error:', error);
      }
    }

    throw new BadRequestException('Unable to fetch swap quote');
  }

  private async getZeroXQuote(
    fromToken: string,
    toToken: string,
    fromAmount: string,
    chainId: number,
    slippage: number,
  ) {
    const chainName = this.getChainNameFor0x(chainId);
    const url = `https://${chainName}.api.0x.org/swap/v1/quote`;

    const params = {
      buyToken: toToken,
      sellToken: fromToken,
      sellAmount: fromAmount,
      slippagePercentage: slippage / 100,
    };

    const response = await firstValueFrom(
      this.httpService.get(url, {
        params,
        headers: {
          '0x-api-key': this.zeroXApiKey,
        },
      }),
    );

    const quote = response.data;

    return {
      fromToken,
      toToken,
      fromAmount,
      toAmount: quote.buyAmount,
      priceImpact: parseFloat(quote.estimatedPriceImpact || '0'),
      gasEstimate: quote.estimatedGas || '0',
      route: quote.orders || [],
      tx: {
        to: quote.to,
        data: quote.data,
        value: quote.value || '0',
        gasLimit: quote.gas || '210000',
      },
    };
  }

  private async getOneInchQuote(
    fromToken: string,
    toToken: string,
    fromAmount: string,
    chainId: number,
    slippage: number,
  ) {
    const url = `https://api.1inch.io/v5.0/${chainId}/swap`;

    const params = {
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      amount: fromAmount,
      fromAddress: '0x0000000000000000000000000000000000000000', // Will be set by user
      slippage: slippage,
      disableEstimate: false,
    };

    const response = await firstValueFrom(
      this.httpService.get(url, {
        params,
        headers: {
          Authorization: `Bearer ${this.oneInchApiKey}`,
        },
      }),
    );

    const quote = response.data;

    return {
      fromToken,
      toToken,
      fromAmount,
      toAmount: quote.toTokenAmount,
      priceImpact: parseFloat(quote.estimatedPriceImpact || '0'),
      gasEstimate: quote.tx.gas || '0',
      route: quote.protocols || [],
      tx: {
        to: quote.tx.to,
        data: quote.tx.data,
        value: quote.tx.value || '0',
        gasLimit: quote.tx.gas || '210000',
      },
    };
  }

  private getChainNameFor0x(chainId: number): string {
    const mapping: Record<number, string> = {
      1: 'api',
      137: 'polygon',
      42161: 'arbitrum',
      10: 'optimism',
      8453: 'base',
    };
    return mapping[chainId] || 'api';
  }

  async executeSwap(
    quote: any,
    walletAddress: string,
    chainId: number,
  ) {
    // Update transaction with user's address
    const tx = {
      ...quote.tx,
      from: walletAddress,
    };

    return {
      ...quote,
      tx,
    };
  }
}

