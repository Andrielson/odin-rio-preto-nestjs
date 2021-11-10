import { Test, TestingModule } from '@nestjs/testing';
import { PublicationsMessageService } from './publications-message.service';

describe('PublicationsMessageService', () => {
  let service: PublicationsMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicationsMessageService],
    }).compile();

    service = module.get<PublicationsMessageService>(PublicationsMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
