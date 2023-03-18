import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import { ChainlinkJobsModule } from './chainlink-jobs/chainlink-jobs.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        ENVIRONMENT: Joi.string().required(),
        PORT: Joi.number().required(),
        CHAINLINK_ORACLE_API_KEY: Joi.string().required(),
        MORALIS_API_KEY: Joi.string().required(),
        BONBONUS_CONTRACT_ADDRESS: Joi.string().required(),
        RPC_URL: Joi.string().required(),
      }),
    }),
    ChainlinkJobsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
