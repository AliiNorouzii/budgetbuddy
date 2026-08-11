// backend/src/accounts/accounts.controller.ts

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateAccountDto) {
    const userId: string = req.user.userId;
    return this.accountsService.create(userId, dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId: string = req.user.userId;
    return this.accountsService.findAllForUser(userId);
  }
}
