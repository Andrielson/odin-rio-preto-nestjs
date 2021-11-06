import { NestFactory } from '@nestjs/core';
import { Subscription } from 'rxjs';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { PublicationsService } from './publications/publications.service';
import { SubscribersService } from './subscribers/subscribers.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appService = app.get(AppService);
  const s0: Subscription = appService.doIt(new Date('2021-11-04')).subscribe({
    next: (dto) => console.log({ publication: dto.email }),
    error: (error) => console.error({ error }),
    complete: () => s0.unsubscribe(),
  });

  const subs = app.get(SubscribersService);
  const s1: Subscription = subs.findAll().subscribe({
    next: (subscriber) => console.log({ subscriber }),
    error: (error) => console.error({ error }),
    complete: () => s1.unsubscribe(),
  });

  const pubs = app.get(PublicationsService);
  const s2: Subscription = pubs
    .findByKeywordAndDate('semae', new Date('2021-11-04'))
    .subscribe({
      next: (publication) => console.log({ publication }),
      error: (error) => console.error({ error }),
      complete: () => s2.unsubscribe(),
    });

  await app.close();
}
bootstrap();
