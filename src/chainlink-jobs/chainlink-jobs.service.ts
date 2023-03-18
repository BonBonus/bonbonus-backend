import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CalculateGlobalRatingDto } from './dto/calculateGlobalRating.dto';
import { CalculateProviderRatingDto } from './dto/calculateProviderRating.dto';

import { BonBonusContractManager } from '../web3/contracts/BonBonus.contract';

@Injectable()
export class ChainlinkJobsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly bonBonusManager: BonBonusContractManager,
  ) {}
  async calculateGlobalRating(data: CalculateGlobalRatingDto): Promise<{ rating: number } | BadRequestException> {
    return {
      rating: 4,
    };
  }

  async calculateProviderRating(
    data: CalculateProviderRatingDto,
  ): Promise<{ rating: number } | BadRequestException> {
    const allPoints = await this.bonBonusManager.getTokenProviderRatings(
      data.data.token,
      data.data.provider,
    );

    if (!allPoints) {
      throw new BadRequestException();
    }

    let finalPoint = 0;

    for (let i = 0; i < allPoints.length; i++) {
      finalPoint += Number(allPoints[i]);
    }

    finalPoint = Number((finalPoint / allPoints.length).toFixed(2)) * 100;

    return {
      rating: finalPoint,
    };
  }
}
