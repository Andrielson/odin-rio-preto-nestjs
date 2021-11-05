import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { PublicationsService } from './publications/publications.service';
import { SubscribersService } from './subscribers/subscribers.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appService = app.get(AppService);
  const message = appService.getHello();
  console.log({ message });

  const subs = app.get(SubscribersService);
  subs.findAll().subscribe((subscriber) => console.log({ subscriber }));

  const pubs = app.get(PublicationsService);
  pubs
    .findByKeywordAndDate('semae', new Date('2021-11-04'))
    .subscribe((publication) => console.log({ publication }));

  await app.close();
}
bootstrap();
