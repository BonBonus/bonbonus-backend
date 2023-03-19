import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CalculateTokenRatingDto } from './dto/calculateTokenRating.dto';

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

  async calculateTokenRating(
    data: CalculateTokenRatingDto,
  ): Promise<
    { global_rating: number; provider_rating: number } | BadRequestException
  > {
    const allPoints = await this.bonBonusManager.getTokenProviderRatings(
      data.data.token,
      data.data.provider,
    );

    if (!allPoints) {
      throw new BadRequestException();
    }

    const finalPoint = Math.round(
      (allPoints.reduce((acc, cur) => acc + Number(cur), 0) /
        allPoints.length) *
        100,
    );

    const providers = await this.bonBonusManager.getTokenParticipatingProviders(
      data.data.token,
    );

    if (!providers) {
      throw new BadRequestException();
    }

    const providersWeights = {};
    const usingProviders = [];
    let providerWeightSum = 0;
    const providersSum = {};

    for (const provider of providers) {
      const providerType = await this.bonBonusManager.getProviderInfo(provider);
      const providerRatings =
        await this.bonBonusManager.getTokenProviderRatings(
          data.data.token,
          provider,
        );

      usingProviders.push(Number(providerType.providerType));
      providerWeightSum += providerData[provider];
      providersSum[provider] =
        providerRatings.reduce((acc, cur) => acc + Number(cur), 0) /
        providerRatings.length;
    }

    for (const provider of providers) {
      providersWeights[provider] = providerData[provider] / providerWeightSum;
    }

    const result = Object.keys(providersSum).reduce(
      (acc, cur) => acc + providersSum[cur] * providersWeights[cur],
      0,
    );

    return {
      global_rating: finalPoint,
      provider_rating: Math.round(result * 100),
    };
  }
}
