import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { PublicationsMessageModule } from 'src/mail/messages/publications-message/publications-message.module';
import { PublicationsModule } from 'src/publications/publications.module';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { SearchService } from './search.service';

@Module({
  imports: [
    MailModule,
    PublicationsModule,
    SubscribersModule,
    PublicationsMessageModule,
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
