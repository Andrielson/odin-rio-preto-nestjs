import { Injectable, Scope } from '@nestjs/common';
import { from, iif, map, mergeMap, of, toArray } from 'rxjs';
import { PublicationsMessageDto } from 'src/mails/interfaces/publications-message-dto.interface';
import { Publication } from 'src/publications/publication';
import { PublicationsService } from 'src/publications/publications.service';
import { Subscriber } from 'src/subscribers/subscriber';

@Injectable({ scope: Scope.TRANSIENT })
export class Searcher {
  readonly #publicationsCache = new Map<string, Publication[]>();
  readonly #pubService: PublicationsService;

  constructor(service: PublicationsService) {
    this.#pubService = service;
  }

  run({ email, keywords, unsubscribeLink }: Subscriber, date: Date) {
    return from(keywords).pipe(
      mergeMap((keyword) =>
        this.#fromCache('semae', date).pipe(
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

  #fromCache(keyword: string, date: Date) {
    return iif(
      () => this.#publicationsCache.has(keyword),
      of(this.#publicationsCache.get(keyword)!),
      this.#pubService.findByKeywordAndDate(keyword, date).pipe(
        toArray(),
        map(
          (publications) =>
            this.#publicationsCache.set(keyword, publications).get(keyword)!,
        ),
      ),
    );
  }
}
