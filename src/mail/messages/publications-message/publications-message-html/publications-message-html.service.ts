import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Publication } from 'src/publications/publication';
import { PUBLICATIONS_MESSAGE_HTML_TEMPLATE } from './publications-message-html-template.provider';

@Injectable()
export class PublicationsMessageHtmlService {
  readonly #logger = new Logger(PublicationsMessageHtmlService.name);
  readonly #year = new Date().getFullYear();
  readonly #appUrl: string;
  readonly #mailAssetsUrl: string;
  readonly #template: string;

  constructor(
    @Inject(PUBLICATIONS_MESSAGE_HTML_TEMPLATE)
    template: string,
    config: ConfigService,
  ) {
    this.#appUrl = config.get<string>('APP_URL')!;
    this.#mailAssetsUrl = config.get<string>('MAIL_ASSETS_URL')!;
    this.#template = template;
  }

  getHtml(
    formattedDate: string,
    publicationsByKeyword: Map<string, Publication[]>,
    unsubscribeLink: string,
  ) {
    return this.#template
      .replace(/%APP_URL%/g, this.#appUrl)
      .replace(/%MAIL_ASSETS_URL%/g, this.#mailAssetsUrl)
      .replace(/%UNSUBSCRIBE_LINK%/g, unsubscribeLink)
      .replace(/%YEAR%/g, `${this.#year}`)
      .replace(
        /%MESSAGE%/g,
        this.#getHtmlMessage(formattedDate, publicationsByKeyword),
      );
  }

  #getHtmlMessage(
    formattedDate: string,
    publicationsByKeyword: Map<string, Publication[]>,
  ) {
    return publicationsByKeyword.size === 1 && publicationsByKeyword.has('*')
      ? this.#getHtmlMessageWithWildcard(
          formattedDate,
          publicationsByKeyword.get('*')!,
        )
      : this.#getHtmlMessageWithKeywords(formattedDate, publicationsByKeyword);
  }

  #getHtmlMessageWithWildcard(
    formattedDate: string,
    publications: Publication[],
  ) {
    if (publications.length === 0)
      return `Não houve publicações no Diário Oficial de São José do Rio Preto na data de <span>${formattedDate}</span>.`;
    const publicationsList = this.#makePublicationsListHtml(publications);
    return `Segue a lista das publicações no Diário Oficial de São José do Rio Preto na data de <span>${formattedDate}</span>${publicationsList}`;
  }

  #getHtmlMessageWithKeywords(
    formattedDate: string,
    publicationsByKeyword: Map<string, Publication[]>,
  ) {
    const keywordsList = [...publicationsByKeyword.entries()]
      .map(([keyword, publications]) => {
        const keywordResult =
          publications.length === 0
            ? `: <i>não houve publicações com este termo.</i>`
            : this.#makePublicationsListHtml(publications);
        return `<li><b>${keyword}</b>${keywordResult}</li>`;
      })
      .join('');
    return `Segue a lista das publicações no Diário Oficial de São José do Rio Preto na data de <span>${formattedDate}</span><ul>${keywordsList}</ul>`;
  }

  #makePublicationsListHtml(publications: Publication[]) {
    const listItems = publications
      .map(({ code, link }) => `<li><a href="${link}">${code}</a></li>`)
      .join('');
    return `<ul>${listItems}</ul>`;
  }
}
