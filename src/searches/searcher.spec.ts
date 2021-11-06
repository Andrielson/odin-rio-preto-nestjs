import { Test, TestingModule } from '@nestjs/testing';
import { Searcher } from './searcher';

describe('Searcher', () => {
  let searcher: Searcher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Searcher],
    }).compile();

    searcher = module.get<Searcher>(Searcher);
  });

  it('should be defined', () => {
    expect(searcher).toBeDefined();
  });
});
