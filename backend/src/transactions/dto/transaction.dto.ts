import { IsString, IsNumber, IsObject, IsOptional } from 'class-validator';

export class SendTransactionDto {
  @IsString()
  walletId: string;

  @IsObject()
  transaction: any;

  @IsNumber()
  chainId: number;

  @IsOptional()
  @IsString()
  signedTx?: string;
}

