import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { subDays } from 'date-fns';
import { catchError, concat, EMPTY, merge } from 'rxjs';
import { AppModule } from './app.module';
import { AppService } from './app.service';

function getDates(date: Date) {
  return date.getDay() === 1
    ? [subDays(date, 2), subDays(date, 1), date]
    : [date];
}

async function bootstrap() {
  const logger = new Logger('main.ts');
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();
  const appService = app.get(AppService);
  const myDate = new Date('2021-10-04');

  const dates = getDates(myDate);
  const searches = dates.map((d) => appService.searchAndNotify(d));

  const subscription = merge(...searches)
    .pipe(
      catchError((error) => {
        logger.error(error);
        return EMPTY;
      }),
    )
    .subscribe({
      complete: async () => {
        await app.close();
        subscription.unsubscribe();
      },
    });
}
bootstrap();
