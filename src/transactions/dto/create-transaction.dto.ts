import { IsString, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
  @IsString()
  accountId: string;

  @IsNumber()
  amountCents: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  description: string;

  @IsDateString()
  transactionDate: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
