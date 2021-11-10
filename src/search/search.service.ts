import { Injectable, Logger } from '@nestjs/common';
import { from, iif, map, mergeMap, of, tap, toArray } from 'rxjs';
import { MailSchedulerService } from 'src/mail/mail-scheduler.service';
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
  readonly #mailScheduler: MailSchedulerService;
  readonly #msgService: PublicationsMessageService;
  readonly #pubService: PublicationsService;
  readonly #subService: SubscribersService;

  constructor(
    mailScheduler: MailSchedulerService,
    msgService: PublicationsMessageService,
    pubService: PublicationsService,
    subService: SubscribersService,
  ) {
    this.#mailScheduler = mailScheduler;
    this.#msgService = msgService;
    this.#pubService = pubService;
    this.#subService = subService;
  }

  searchByDate(date: Date) {
    const publicationsCache = new Map<string, Publication[]>();
    return this.#subService.findAll().pipe(
      tap((sub) =>
        this.#logger.log(
          `Searching publications for ${sub.email} on ${date
            .toISOString()
            .slice(0, 10)}...`,
        ),
      ),
      mergeMap((sub) =>
        this.#searchPublicationsBySubscriber(sub, date, publicationsCache).pipe(
          tap((dto) => this.#logger.log(`Composing email to ${dto.email}...`)),
          map((dto) => this.#msgService.getMessage(date, dto)),
          map((message) => this.#mailScheduler.addMessage(message)),
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
