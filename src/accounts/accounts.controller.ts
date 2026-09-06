// backend/src/accounts/accounts.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateAccountDto) {
    const userId: string = req.user.sub;
    return this.accountsService.create(userId, dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId: string = req.user.sub;
    return this.accountsService.findAllForUser(userId);
  }

  @Patch(':accountId')
  async update(
    @Req() req: any,
    @Param('accountId', new ParseUUIDPipe()) accountId: string,
    @Body() dto: UpdateAccountDto,
  ) {
    const userId: string = req.user.sub;
    return this.accountsService.update(userId, accountId, dto);
  }
}
