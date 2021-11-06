import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SubscribersModule } from './subscribers/subscribers.module';
import { PublicationsModule } from './publications/publications.module';
import { SearchesModule } from './searches/searches.module';
import { MailsModule } from './mails/mails.module';

@Module({
  imports: [SubscribersModule, PublicationsModule, SearchesModule, MailsModule],
  providers: [AppService],
})
export class AppModule {}
