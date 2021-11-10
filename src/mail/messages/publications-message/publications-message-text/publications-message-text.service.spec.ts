import { Test, TestingModule } from '@nestjs/testing';
import { PublicationsMessageTextService } from './publications-message-text.service';

describe('PublicationsMessageTextService', () => {
  let service: PublicationsMessageTextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicationsMessageTextService],
    }).compile();

    service = module.get<PublicationsMessageTextService>(PublicationsMessageTextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
