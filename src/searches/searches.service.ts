import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { combineLatest, from, mapTo, mergeMap, tap } from 'rxjs';
import { MailService } from 'src/mails/mail.service';
import { PublicationsMessageFactory } from 'src/mails/messages/publications-message-factory';
import { SubscribersService } from 'src/subscribers/subscribers.service';
import { Searcher } from './searcher';

@Injectable()
export class SearchesService {
  readonly #logger = new Logger(SearchesService.name);
  readonly #moduleRef: ModuleRef;
  readonly #mailer: MailService;
  readonly #messageFactory: PublicationsMessageFactory;
  readonly #subService: SubscribersService;

  constructor(
    moduleRef: ModuleRef,
    mailer: MailService,
    messageFactory: PublicationsMessageFactory,
    subService: SubscribersService,
  ) {
    this.#moduleRef = moduleRef;
    this.#mailer = mailer;
    this.#messageFactory = messageFactory;
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
          .sendMail(this.#messageFactory.getMessage(date, dto))
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
