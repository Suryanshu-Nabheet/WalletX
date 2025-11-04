import { IsEnum, IsString, IsObject, IsOptional } from 'class-validator';
import { WalletMode } from '@walletx/shared';

export class CreateWalletDto {
  @IsEnum(WalletMode)
  mode: WalletMode;

  @IsString()
  chain: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsObject()
  encryptedBlob?: any;
}

export class UpdateWalletDto {
  @IsOptional()
  @IsObject()
  encryptedBlob?: any;

  @IsOptional()
  @IsString()
  blobVersion?: string;
}

