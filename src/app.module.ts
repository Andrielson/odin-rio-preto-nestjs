import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SubscribersModule } from './subscribers/subscribers.module';
import { PublicationsModule } from './publications/publications.module';
import { SearchModule } from './search/search.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

const isGlobal = true;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal }),
    SubscribersModule,
    PublicationsModule,
    SearchModule,
    MailModule,
  ],
  providers: [AppService],
})
export class AppModule {}
