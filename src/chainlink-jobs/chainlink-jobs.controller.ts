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

import { CalculateGlobalRatingDto } from './dto/calculateGlobalRating.dto';
import { CalculateProviderRatingDto } from './dto/calculateProviderRating.dto';

import { ChainlinkJobsService } from './chainlink-jobs.service';

@Controller('chainlink-jobs')
export class ChainlinkJobsController {
  constructor(private readonly chainlinkJobsService: ChainlinkJobsService) {}

  @Post('calculate-global-rating')
  @HttpCode(200)
  @UseGuards(ChainlinkOracleGuard)
  @Throttle(15, 30)
  @ApiSecurity('oracle-api-key')
  @ApiTags('Chainlink jobs')
  calculateGlobalRating(
    @Req() request: Request,
    @Body() data: CalculateGlobalRatingDto,
  ): Promise<{ rating: number } | BadRequestException> {
    return this.chainlinkJobsService.calculateGlobalRating(data);
  }

  @Post('calculate-provider-rating')
  @HttpCode(200)
  @UseGuards(ChainlinkOracleGuard)
  @Throttle(15, 30)
  @ApiSecurity('oracle-api-key')
  @ApiTags('Chainlink jobs')
  calculateProviderRating(
    @Req() request: Request,
    @Body() data: CalculateProviderRatingDto,
  ): Promise<{ rating: number } | BadRequestException> {
    return this.chainlinkJobsService.calculateProviderRating(data);
  }
}
