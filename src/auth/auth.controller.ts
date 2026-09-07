import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const COOKIE_MAX_AGE_MS =24 * 60 *  ‌و 60 *  ‌و 60 *  ‌و 60 *  ‌و  ‌و  ‌و  ‌و  ‌و  ‌و  ‌و
