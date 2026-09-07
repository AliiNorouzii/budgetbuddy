import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'نام دسته‌بندی نمی‌تواند خالی باشد.' })
  name: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsNotEmpty({ message: 'شناسه کاربر اجباری است.' })
  userId: string;
}
