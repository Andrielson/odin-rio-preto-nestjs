import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Subscriber } from './subscriber';

@Injectable()
export class SubscribersService {
  readonly #http!: HttpService;
  readonly #apiUrl: string = 'http://web:3000/api/subscribers';

  constructor(httpService: HttpService) {
    this.#http = httpService;
  }

  public findAll() {
    return this.#http
      .get<Subscriber[]>(this.#apiUrl)
      .pipe(concatMap(({ data }) => from(data)));
  }
}
