import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateAccountDto) {
    const userId = req.user.sub || req.user.id;
    return this.accountsService.create(userId, dto);
  }

  @Get()
  async findAll(@Request() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.accountsService.findAllForUser(userId);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.sub || req.user.id;
    return this.accountsService.findOne(userId, id);
  }

  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateAccountDto,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.accountsService.update(userId, id, dto);
  }
}
