import { Test, TestingModule } from '@nestjs/testing';
import { ChainlinkJobsController } from './chainlink-jobs.controller';

describe('ChainlinkJobsController', () => {
  let controller: ChainlinkJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChainlinkJobsController],
    }).compile();

    controller = module.get<ChainlinkJobsController>(ChainlinkJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
