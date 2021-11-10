import { Module } from '@nestjs/common';
import { PublicationsMessageTextTemplateProvider } from './publications-message-text-template.provider';
import { PublicationsMessageTextService } from './publications-message-text.service';

@Module({
  providers: [
    PublicationsMessageTextTemplateProvider,
    PublicationsMessageTextService,
  ],
  exports: [PublicationsMessageTextService],
})
export class PublicationsMessageTextModule {}
