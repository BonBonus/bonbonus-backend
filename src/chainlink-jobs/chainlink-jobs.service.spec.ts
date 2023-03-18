import { Test, TestingModule } from '@nestjs/testing';
import { ChainlinkJobsService } from './chainlink-jobs.service';

describe('ChainlinkJobsService', () => {
  let service: ChainlinkJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChainlinkJobsService],
    }).compile();

    service = module.get<ChainlinkJobsService>(ChainlinkJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
