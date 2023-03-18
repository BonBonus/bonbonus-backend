import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ChainlinkJobsController } from './chainlink-jobs.controller';

import { ChainlinkJobsService } from './chainlink-jobs.service';

import { BonBonusContractManager } from '../web3/contracts/BonBonus.contract';

@Module({
  controllers: [ChainlinkJobsController],
  providers: [ChainlinkJobsService, ConfigService, BonBonusContractManager],
})
export class ChainlinkJobsModule {}
