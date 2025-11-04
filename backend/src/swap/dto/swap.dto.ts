import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class SwapQuoteDto {
  @IsString()
  fromToken: string;

  @IsString()
  toToken: string;

  @IsString()
  fromAmount: string;

  @IsNumber()
  chainId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  slippage?: number;
}

export class SwapExecuteDto {
  @IsString()
  fromToken: string;

  @IsString()
  toToken: string;

  @IsString()
  fromAmount: string;

  @IsNumber()
  chainId: number;

  @IsString()
  walletAddress: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  slippage?: number;
}

