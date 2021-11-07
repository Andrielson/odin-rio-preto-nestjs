import { Module } from '@nestjs/common';
import { PublicationsMessageService } from './publications-message.service';
import { PublicationsMessageHtmlModule } from './publications-message-html/publications-message-html.module';
import { PublicationsMessageTextModule } from './publications-message-text/publications-message-text.module';

@Module({
  imports: [PublicationsMessageHtmlModule, PublicationsMessageTextModule],
  providers: [PublicationsMessageService],
  exports: [PublicationsMessageService],
})
export class PublicationsMessageModule {}
