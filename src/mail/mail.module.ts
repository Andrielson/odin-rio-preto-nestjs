import { Module } from '@nestjs/common';
import mailServiceProvider from './providers/mail-service.provider';
import { MailService } from './mail.service';
import { MailSchedulerService } from './mail-scheduler.service';

@Module({
  providers: [mailServiceProvider, MailSchedulerService],
  exports: [MailService, MailSchedulerService],
})
export class MailModule {}
