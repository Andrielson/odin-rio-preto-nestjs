import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { concatMap, from, map } from 'rxjs';
import { Subscriber } from './subscriber';

@Injectable()
export class SubscribersService {
  readonly #http!: HttpService;
  readonly #apiUrl: string = 'http://web:3000/api/subscribers';

  constructor(httpService: HttpService) {
    this.#http = httpService;
  }

  public findAll() {
    return this.#http.get<Subscriber[]>(this.#apiUrl).pipe(
      map(({ data }) =>
        data.map(
          ({ email, keywords, unsubscribeLink }) =>
            new Subscriber(email, keywords, unsubscribeLink),
        ),
      ),
      concatMap((subscribers) => from(subscribers)),
    );
  }
}
