import { Test, TestingModule } from '@nestjs/testing';
import { PublicationsMessageFactory } from './publications-message-factory';

describe('PublicationsMessageFactory', () => {
  let provider: PublicationsMessageFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicationsMessageFactory],
    }).compile();

    provider = module.get<PublicationsMessageFactory>(PublicationsMessageFactory);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
