import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { ChainlinkOracleGuard } from '../common/guards/chainlinkOracle.guard';

import { CalculateTokenRatingDto } from './dto/calculateTokenRating.dto';

import { ChainlinkJobsService } from './chainlink-jobs.service';

@Controller('chainlink-jobs')
export class ChainlinkJobsController {
  constructor(private readonly chainlinkJobsService: ChainlinkJobsService) {}

  @Post('calculate-token-rating')
  @HttpCode(200)
  @UseGuards(ChainlinkOracleGuard)
  @Throttle(15, 30)
  @ApiSecurity('oracle-api-key')
  @ApiTags('Chainlink jobs')
  calculateTokenRating(
    @Req() request: Request,
    @Body() data: CalculateTokenRatingDto,
  ): Promise<
    { global_rating: number; provider_rating: number } | BadRequestException
  > {
    return this.chainlinkJobsService.calculateTokenRating(data);
  }
}
