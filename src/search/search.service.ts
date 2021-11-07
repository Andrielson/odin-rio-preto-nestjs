import { Injectable, Logger } from '@nestjs/common';
import { from, iif, map, mapTo, mergeMap, of, toArray } from 'rxjs';
import { PublicationsMessageDto } from 'src/mail/interfaces/publications-message-dto.interface';
import { MailService } from 'src/mail/mail.service';
import { PublicationsMessageFactory } from 'src/mail/messages/publications-message-factory';
import { Publication } from 'src/publications/publication';
import { PublicationsService } from 'src/publications/publications.service';
import { Subscriber } from 'src/subscribers/subscriber';
import { SubscribersService } from 'src/subscribers/subscribers.service';

type PublicationsCache = Map<string, Publication[]>;

@Injectable()
export class SearchService {
  readonly #logger = new Logger(SearchService.name);
  readonly #mailer: MailService;
  readonly #messageFactory: PublicationsMessageFactory;
  readonly #pubService: PublicationsService;
  readonly #subService: SubscribersService;

  constructor(
    mailer: MailService,
    messageFactory: PublicationsMessageFactory,
    pubService: PublicationsService,
    subService: SubscribersService,
  ) {
    this.#mailer = mailer;
    this.#messageFactory = messageFactory;
    this.#pubService = pubService;
    this.#subService = subService;
  }

  searchByDate(date: Date) {
    const publicationsCache = new Map<string, Publication[]>();
    return this.#subService.findAll().pipe(
      mergeMap((sub) =>
        this.#searchPublicationsBySubscriber(sub, date, publicationsCache),
      ),
      mergeMap((dto) =>
        this.#mailer
          .sendMail(this.#messageFactory.getMessage(date, dto))
          .pipe(mapTo(dto)),
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
        this.#fromCache('semae', date, publicationsCache).pipe(
          map(
            (publications) =>
              [keyword, publications] as [string, Publication[]],
          ),
        ),
      ),
      toArray(),
      map(
        (entries): PublicationsMessageDto => ({
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
