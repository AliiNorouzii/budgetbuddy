// backend/src/accounts/dto/create-account.dto.ts

import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsInt()
  @Min(0)
  balanceCents!: number;
}
