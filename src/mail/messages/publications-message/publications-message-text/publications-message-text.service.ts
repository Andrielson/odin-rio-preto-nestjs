import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Publication } from 'src/publications/publication';
import { PUBLICATIONS_MESSAGE_TEXT_TEMPLATE } from './publications-message-text-template.provider';

@Injectable()
export class PublicationsMessageTextService {
  readonly #logger = new Logger(PublicationsMessageTextService.name);
  readonly #year = new Date().getFullYear();
  readonly #appUrl: string;
  readonly #template: string;

  constructor(
    @Inject(PUBLICATIONS_MESSAGE_TEXT_TEMPLATE)
    template: string,
    config: ConfigService,
  ) {
    this.#appUrl = config.get<string>('APP_URL')!;
    this.#template = template;
  }

  getText(
    formattedDate: string,
    publicationsByKeyword: Map<string, Publication[]>,
    unsubscribeLink: string,
  ) {
    return this.#template
      .replace(/%APP_URL%/g, this.#appUrl)
      .replace(/%UNSUBSCRIBE_LINK%/g, unsubscribeLink)
      .replace(/%YEAR%/g, `${this.#year}`)
      .replace(
        /%MESSAGE%/g,
        this.#getTextMessage(formattedDate, publicationsByKeyword),
      );
  }

  #getTextMessage(
    formattedDate: string,
    publicationsByKeyword: Map<string, Publication[]>,
  ) {
    return publicationsByKeyword.size === 1 && publicationsByKeyword.has('*')
      ? this.#getTextMessageWithWildcard(
          formattedDate,
          publicationsByKeyword.get('*')!,
        )
      : this.#getTextMessageWithKeywords(formattedDate, publicationsByKeyword);
  }

  #getTextMessageWithWildcard(
    formattedDate: string,
    publications: Publication[],
  ) {
    if (publications.length === 0)
      return `Não houve publicações no Diário Oficial de São José do Rio Preto na data de ${formattedDate}.`;
    const publicationsList = this.#makePublicationsListText(publications, 1);
    return `Segue a lista das publicações no Diário Oficial de São José do Rio Preto na data de ${formattedDate}\n\n${publicationsList}`;
  }

  #getTextMessageWithKeywords(
    formattedDate: string,
    publicationsByKeyword: Map<string, Publication[]>,
  ) {
    const keywordsList = [...publicationsByKeyword.entries()]
      .map(([keyword, publications]) => {
        const keywordResult =
          publications.length === 0
            ? `: não houve publicações com este termo.`
            : `\n${this.#makePublicationsListText(publications)}`;
        return `\t• ${keyword}${keywordResult}`;
      })
      .join('\n');
    return `Segue a lista das publicações no Diário Oficial de São José do Rio Preto na data de ${formattedDate}\n\n${keywordsList}`;
  }

  #makePublicationsListText(publications: Publication[], tabs = 2) {
    const tabulations = Array(tabs).fill('\t').join('');
    return publications.map(({ link }) => `${tabulations}▪ ${link}`).join('\n');
  }
}
