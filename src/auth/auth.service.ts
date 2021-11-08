import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, tap } from 'rxjs';

interface OAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable()
export class AuthService {
  readonly #logger = new Logger(AuthService.name);
  readonly #config: ConfigService;
  readonly #http: HttpService;

  constructor(config: ConfigService, http: HttpService) {
    this.#config = config;
    this.#http = http;
  }

  get header$() {
    return this.token$.pipe(
      map((token) => ({ Authorization: `Bearer ${token}` })),
    );
  }

  get token$() {
    const url = this.#config.get<string>('OAUTH_API_URL')!;
    const audience = this.#config.get<string>('OAUTH_AUDIENCE')!;
    const client_id = this.#config.get<string>('OAUTH_CLIENT_ID')!;
    const client_secret = this.#config.get<string>('OAUTH_CLIENT_SECRET')!;
    const grant_type = this.#config.get<string>('OAUTH_GRANT_TYPE')!;

    this.#logger.log(`POST request to ${url}...`);
    return this.#http
      .post<OAuthToken>(url, { audience, client_id, client_secret, grant_type })
      .pipe(
        tap(() => this.#logger.log(`Processing Access Token...`)),
        map(({ data }) => data.access_token),
      );
  }
}
