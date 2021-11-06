import { NestFactory } from '@nestjs/core';
import { Subscription } from 'rxjs';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();
  const appService = app.get(AppService);
  const s0: Subscription = appService.doIt(new Date('2021-11-04')).subscribe({
    next: (dto) => console.log({ dto }),
    error: (error) => console.error({ error }),
    complete: () => s0.unsubscribe(),
  });

  await app.close();
}
bootstrap();
