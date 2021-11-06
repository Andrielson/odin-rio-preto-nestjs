import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { combineLatest, from, mergeMap } from 'rxjs';
import { SubscribersService } from 'src/subscribers/subscribers.service';
import { Searcher } from './searcher';

@Injectable()
export class SearchesService {
  readonly #subService: SubscribersService;
  readonly #moduleRef: ModuleRef;

  constructor(moduleRef: ModuleRef, subService: SubscribersService) {
    this.#moduleRef = moduleRef;
    this.#subService = subService;
  }

  searchByDate(date: Date) {
    return combineLatest([
      from(this.#moduleRef.resolve(Searcher)),
      this.#subService.findAll(),
    ]).pipe(mergeMap(([searcher, sub]) => searcher.run(sub, date)));
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
