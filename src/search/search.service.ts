import { Injectable, Logger } from '@nestjs/common';
import {
  concatMap,
  delay,
  from,
  iif,
  map,
  mergeMap,
  of,
  tap,
  toArray,
} from 'rxjs';
import { MailService } from 'src/mail/mail.service';
import { PublicationsMessageDto } from 'src/mail/messages/publications-message/publications-message-dto.interface';
import { PublicationsMessageService } from 'src/mail/messages/publications-message/publications-message.service';
import { Publication } from 'src/publications/publication';
import { PublicationsService } from 'src/publications/publications.service';
import { Subscriber } from 'src/subscribers/subscriber';
import { SubscribersService } from 'src/subscribers/subscribers.service';

type PublicationsCache = Map<string, Publication[]>;

@Injectable()
export class SearchService {
  readonly #logger = new Logger(SearchService.name);
  readonly #mailer: MailService;
  readonly #msgService: PublicationsMessageService;
  readonly #pubService: PublicationsService;
  readonly #subService: SubscribersService;

  constructor(
    mailer: MailService,
    msgService: PublicationsMessageService,
    pubService: PublicationsService,
    subService: SubscribersService,
  ) {
    this.#mailer = mailer;
    this.#msgService = msgService;
    this.#pubService = pubService;
    this.#subService = subService;
  }

  searchByDate(date: Date) {
    const publicationsCache = new Map<string, Publication[]>();
    return this.#subService.findAll().pipe(
      tap((sub) =>
        this.#logger.log(`Searching publications for ${sub.email}...`),
      ),
      mergeMap((sub) =>
        this.#searchPublicationsBySubscriber(sub, date, publicationsCache),
      ),
      tap((dto) => this.#logger.log(`Composing email to ${dto.email}...`)),
      concatMap((dto) =>
        this.#mailer.sendMail(this.#msgService.getMessage(date, dto)).pipe(
          tap(() => this.#logger.log(`Email sent to ${dto.email}!`)),
          delay(2000),
        ),
      ),
    );
  }

  #searchPublicationsBySubscriber(
    { email, keywords, unsubscribeLink }: Subscriber,
    date: Date,
    publicationsCache: PublicationsCache,
  ) {
    return from(keywords).pipe(
      mergeMap((keyword) =>
        this.#fromCache(keyword, date, publicationsCache).pipe(
          map(
            (publications) =>
              [keyword, publications] as [string, Publication[]],
          ),
        ),
      ),
      toArray(),
      map((entries) =>
        Object.freeze<PublicationsMessageDto>({
          email,
          unsubscribeLink,
          publicationsByKeyword: new Map<string, Publication[]>(entries),
        }),
      ),
    );
  }

  #fromCache(keyword: string, date: Date, cache: PublicationsCache) {
    return iif(
      () => cache.has(keyword),
      of(cache.get(keyword)!),
      this.#pubService.findByKeywordAndDate(keyword, date).pipe(
        toArray(),
        map((publications) => cache.set(keyword, publications).get(keyword)!),
      ),
    );
  }
}
