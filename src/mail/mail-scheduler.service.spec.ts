import { Test, TestingModule } from '@nestjs/testing';
import { MailSchedulerService } from './mail-scheduler.service';

describe('MailSchedulerService', () => {
  let service: MailSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailSchedulerService],
    }).compile();

    service = module.get<MailSchedulerService>(MailSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
