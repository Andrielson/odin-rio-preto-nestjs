import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { PublicationsModule } from 'src/publications/publications.module';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { SearchService } from './search.service';

@Module({
  imports: [MailModule, PublicationsModule, SubscribersModule],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
