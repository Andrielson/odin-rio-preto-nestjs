import { Test, TestingModule } from '@nestjs/testing';
import { PublicationsMessageHtmlService } from './publications-message-html.service';

describe('PublicationsMessageHtmlService', () => {
  let service: PublicationsMessageHtmlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicationsMessageHtmlService],
    }).compile();

    service = module.get<PublicationsMessageHtmlService>(PublicationsMessageHtmlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
