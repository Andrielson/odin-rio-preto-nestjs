import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { concatMap, from } from 'rxjs';
import { Subscriber } from './subscriber';

@Injectable()
export class SubscribersService {
  readonly #logger = new Logger(SubscribersService.name);
  readonly #http!: HttpService;
  readonly #apiUrl: string = 'http://web:3000/api/subscribers';

  constructor(httpService: HttpService) {
    this.#http = httpService;
  }

  public findAll() {
    return this.#http
      .get<Subscriber[]>(this.#apiUrl)
      .pipe(concatMap(({ data }) => from(data.map((it) => Object.freeze(it)))));
  }
}
