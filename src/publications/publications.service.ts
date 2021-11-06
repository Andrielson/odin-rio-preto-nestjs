import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { parse } from 'node-html-parser';
import { concatMap, filter, from, map } from 'rxjs';
import { URLSearchParams } from 'url';
import { Publication } from './publication';

@Injectable()
export class PublicationsService {
  readonly #http!: HttpService;
  readonly #apiUrl: string = 'https://www.riopreto.sp.gov.br/DiarioOficial';

  constructor(httpService: HttpService) {
    this.#http = httpService;
  }

  public findByKeywordAndDate(keyword: string, date: Date) {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    };
    const params = new URLSearchParams({
      'Diario!listar.action': 'Buscar',
      'diario.dataPublicacao': this.convertDateToStringInParamsFormat(date),
    });
    if (keyword !== '*') params.append('diario.palavraChave', keyword);

    return this.#http
      .post<Buffer>(`${this.#apiUrl}/Diario!listar.action`, params.toString(), {
        headers,
        responseType: 'arraybuffer',
      })
      .pipe(
        map(({ data }) => parse(data.toString('utf-8'))),
        concatMap((document) => from(document.getElementsByTagName('a'))),
        filter((anchorElement) => anchorElement.hasAttribute('href')),
        map((anchorWithHref) => anchorWithHref.getAttribute('href')!),
        filter((href) =>
          href.startsWith('Diario!arquivo.action?diario.codPublicacao='),
        ),
        map(
          (href): Publication => ({
            keyword,
            code: href.split('=')[1],
            link: `${this.#apiUrl}/${href}`,
          }),
        ),
      );
  }

  private convertDateToStringInParamsFormat(date: Date) {
    const searchValue = /(\d{4})-(\d{2})-(\d{2}).*/;
    const replaceValue = '$3/$2/$1';
    return date.toISOString().replace(searchValue, replaceValue);
  }
}
