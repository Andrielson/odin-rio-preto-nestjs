import { Module } from '@nestjs/common';
import { PublicationsMessageHtmlTemplateProvider } from './publications-message-html-template.provider';
import { PublicationsMessageHtmlService } from './publications-message-html.service';

@Module({
  providers: [
    PublicationsMessageHtmlTemplateProvider,
    PublicationsMessageHtmlService,
  ],
  exports: [PublicationsMessageHtmlService],
})
export class PublicationsMessageHtmlModule {}
