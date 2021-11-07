import { Module } from '@nestjs/common';
import mailServiceProvider from './providers/mail-service.provider';
import { MailService } from './mail.service';
import { PublicationsMessageFactory } from './messages/publications-message-factory';
import publicationsMessageTemplatesProviders from './providers/publications-message-templates.providers';

@Module({
  providers: [
    ...publicationsMessageTemplatesProviders,
    mailServiceProvider,
    PublicationsMessageFactory,
  ],
  exports: [MailService, PublicationsMessageFactory],
})
export class MailModule {}
