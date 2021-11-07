import { Module } from '@nestjs/common';
import { MailModule } from 'src/mails/mail.module';
import { PublicationsModule } from 'src/publications/publications.module';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { SearchesService } from './searches.service';

@Module({
  imports: [MailModule, PublicationsModule, SubscribersModule],
  providers: [SearchesService],
  exports: [SearchesService],
})
export class SearchesModule {}
