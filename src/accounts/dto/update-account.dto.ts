// backend/src/accounts/dto/update-account.dto.ts

import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  balanceCents?: number;
}
