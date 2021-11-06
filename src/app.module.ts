import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SubscribersModule } from './subscribers/subscribers.module';
import { PublicationsModule } from './publications/publications.module';
import { SearchesModule } from './searches/searches.module';
import { MailModule } from './mails/mail.module';
import { ConfigModule } from '@nestjs/config';

const isGlobal = true;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal }),
    SubscribersModule,
    PublicationsModule,
    SearchesModule,
    MailModule,
  ],
  providers: [AppService],
})
export class AppModule {}
