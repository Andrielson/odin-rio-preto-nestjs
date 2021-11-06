import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { combineLatest, from, mapTo, mergeMap, tap } from 'rxjs';
import { MailService } from 'src/mails/mail.service';
import { SubscribersService } from 'src/subscribers/subscribers.service';
import { Searcher } from './searcher';

@Injectable()
export class SearchesService {
  readonly #logger = new Logger(SearchesService.name);
  readonly #moduleRef: ModuleRef;
  readonly #mailer: MailService;
  readonly #subService: SubscribersService;

  constructor(
    moduleRef: ModuleRef,
    mailer: MailService,
    subService: SubscribersService,
  ) {
    this.#moduleRef = moduleRef;
    this.#mailer = mailer;
    this.#subService = subService;
  }

  searchByDate(date: Date) {
    return combineLatest([
      from(this.#moduleRef.resolve(Searcher)),
      this.#subService.findAll(),
    ]).pipe(
      mergeMap(([searcher, sub]) => searcher.run(sub, date)),
      mergeMap((dto) =>
        this.#mailer
          .sendMail({
            html: '<h1>Teste HTML</h1>',
            subject: 'Teste',
            text: 'Teste TXT',
            to: dto.email,
          })
          .pipe(mapTo(dto)),
      ),
    );
    /*
    return from(this.#moduleRef.resolve(Searcher)).pipe(
      mergeMap((searcher) =>
        this.#subService
          .findAll()
          .pipe(mergeMap((sub) => searcher.run(sub, date))),
      ),
    );
*/
  }
}
