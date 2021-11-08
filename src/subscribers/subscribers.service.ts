import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { concatMap, from, tap } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Subscriber } from './subscriber';

@Injectable()
export class SubscribersService {
  readonly #logger = new Logger(SubscribersService.name);
  readonly #auth: AuthService;
  readonly #config: ConfigService;
  readonly #http: HttpService;

  constructor(auth: AuthService, config: ConfigService, http: HttpService) {
    this.#auth = auth;
    this.#config = config;
    this.#http = http;
  }

  public findAll() {
    const url = this.#config
      .get<string>('API_URL', 'http://web:3000/api')
      .concat('/subscribers');

    return this.#auth.header$.pipe(
      tap(() => this.#logger.log(`GET request to ${url}...`)),
      concatMap((headers) => this.#http.get<Subscriber[]>(url, { headers })),
      tap(() => this.#logger.log(`Processing response...`)),
      concatMap(({ data }) => from(data.map((it) => Object.freeze(it)))),
    );
  }
}
