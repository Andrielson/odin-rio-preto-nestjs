import { Module } from '@nestjs/common';
import mailServiceProvider from './providers/mail-service.provider';
import { MailService } from './mail.service';

@Module({
  providers: [mailServiceProvider],
  exports: [MailService],
})
export class MailModule {}
