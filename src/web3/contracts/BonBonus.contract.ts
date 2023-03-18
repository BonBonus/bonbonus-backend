import { Injectable } from '@nestjs/common';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ConfigService } from '@nestjs/config';
import {
  BonBonus as BonBonusContract,
  BonBonus__factory as BonBonusFactory,
} from '@bonbonus/bonbonus-protocol';

@Injectable()
export class BonBonusContractManager {
  private readonly contract: BonBonusContract;
  private readonly provider: JsonRpcProvider;

  constructor(private readonly configService: ConfigService) {
    this.provider = new JsonRpcProvider(
      this.configService.get<string>('RPC_URL'),
    );
    this.contract = BonBonusFactory.connect(
      this.configService.get<string>('BONBONUS_CONTRACT_ADDRESS'),
      this.provider,
    );
  }

  getTokenProviderRatings = async (
    token: number,
    provider: number,
  ): Promise<number[]> => {
    try {
      return await this.contract.getTokenProviderRatings(token, provider);
    } catch (e) {
      return null;
    }
  };

  getTokenParticipatingProviders = async (token: number): Promise<number[]> => {
    try {
      return await this.contract.getTokenParticipatingProviders(token);
    } catch (e) {
      return null;
    }
  };

  getProviderInfo = async (
    provider: number,
  ): Promise<{
    exists: boolean;
    providerType: any;
  }> => {
    try {
      return await this.contract.providers(provider);
    } catch (e) {
      return null;
    }
  };
}
