import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CalculateGlobalRatingDto } from './dto/calculateGlobalRating.dto';
import { CalculateProviderRatingDto } from './dto/calculateProviderRating.dto';

import { BonBonusContractManager } from '../web3/contracts/BonBonus.contract';

const providerData = {
  '0': 0.063, // sports and fitness
  '1': 0.06, // automotive
  '2': 0.058, // art and crafts
  '3': 0.056, // garden and outdoor
  '4': 0.056, // education and learning
  '5': 0.055, // office supplies
  '6': 0.054, // party supplies
  '7': 0.054, // travel and leisure
  '8': 0.051, // pet supplies
  '9': 0.049, // health and wellness
  '10': 0.048, // beauty and personal care
  '11': 0.047, // home and kitchen
  '12': 0.047, // books and media
  '13': 0.046, // industrial and scientific
  '14': 0.046, // food and beverages
  '15': 0.046, // fashion
  '16': 0.045, // baby and kids
  '17': 0.043, // toys and games
  '18': 0.049, // electronics
  '19': 0.036, // music
};

@Injectable()
export class ChainlinkJobsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly bonBonusManager: BonBonusContractManager,
  ) {}
  async calculateGlobalRating(
    data: CalculateGlobalRatingDto,
  ): Promise<{ rating: number } | BadRequestException> {
    const providers = await this.bonBonusManager.getTokenParticipatingProviders(
      data.data.token,
    );

    if (!providers) {
      throw new BadRequestException();
    }

    const providers_weights = {};

    const using_providers = [];
    let provider_weight_sum = 0;
    const providers_sum = {};

    for (let i = 0; i < providers.length; i++) {
      const providerType = await this.bonBonusManager.getProviderInfo(
        providers[i],
      );
      const providerRatings =
        await this.bonBonusManager.getTokenProviderRatings(
          data.data.token,
          providers[i],
        );

      using_providers.push(Number(providerType.providerType));

      provider_weight_sum += providerData[providers[i]];

      providers_sum[i] = 0;

      for (let j = 0; j < providerRatings.length; j++) {
        providers_sum[i] += Number(providerRatings[j]);
      }

      providers_sum[i] = providers_sum[i] / providerRatings.length;
    }

    for (let i = 0; i < providers.length; i++) {
      providers_weights[providers[i]] =
        providerData[providers[i]] / provider_weight_sum;
    }

    let result = 0;

    for (const provider in providers_sum) {
      result += providers_sum[provider] * providers_weights[provider];
    }

    return {
      rating: Math.round(Number(result.toFixed(2)) * 100),
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

    finalPoint = Math.round(
      Number((finalPoint / allPoints.length).toFixed(2)) * 100,
    );

    return {
      rating: finalPoint,
    };
  }
}
