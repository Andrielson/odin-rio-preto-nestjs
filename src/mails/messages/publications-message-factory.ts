import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Publication } from 'src/publications/publication';
import { MailMessage } from '../interfaces/mail-message.interface';
import { PublicationsMessageDto } from '../interfaces/publications-message-dto.interface';
import {
  PUBLICATIONS_HTML_TEMPLATE,
  PUBLICATIONS_TEXT_TEMPLATE,
} from '../providers/publications-message-templates.providers';

@Injectable()
export class PublicationsMessageFactory {
  readonly #logger = new Logger(PublicationsMessageFactory.name);
  readonly #year = new Date().getFullYear();
  readonly #appUrl: string;
  readonly #mailAssetsUrl: string;
  readonly #htmlTemplate: string;
  readonly #textTemplate: string;

  constructor(
    @Inject(PUBLICATIONS_HTML_TEMPLATE)
    htmlTemplate: string,
    @Inject(PUBLICATIONS_TEXT_TEMPLATE)
    textTemplate: string,
    config: ConfigService,
  ) {
    this.#appUrl = config.get<string>('APP_URL')!;
    this.#mailAssetsUrl = config.get<string>('MAIL_ASSETS_URL')!;
    this.#htmlTemplate = htmlTemplate;
    this.#textTemplate = textTemplate;
  }

  getMessage(date: Date, dto: PublicationsMessageDto) {
    const formattedDate = this.#formatDate(date);
    return Object.freeze<MailMessage>({
      html: this.#getHtml(formattedDate, dto),
      subject: `Publicações do dia ${formattedDate}`,
      text: this.#getText(formattedDate, dto),
      to: dto.email,
    });
  }

  #formatDate(date: Date) {
    const searchValue = /(\d{4})-(\d{2})-(\d{2}).*/;
    const replaceValue = '$3/$2/$1';
    return date.toISOString().replace(searchValue, replaceValue);
  }

  #replaceCommonInfo(
    template: string,
    unsubscribeLink: string,
    message: string,
  ) {
    return template
      .replace(/%APP_URL%/g, this.#appUrl)
      .replace(/%UNSUBSCRIBE_LINK%/g, unsubscribeLink)
      .replace(/%YEAR%/g, `${this.#year}`)
      .replace(/%MESSAGE%/g, message);
  }

  #getHtml(
    formattedDate: string,
    { publicationsByKeyword, unsubscribeLink }: PublicationsMessageDto,
  ) {
    const message =
      publicationsByKeyword.size === 0
        ? `Não houve publicações no Diário Oficial de São José do Rio Preto na data de <span>${formattedDate}</span>`
        : this.#makePublicationsListHtml(formattedDate, publicationsByKeyword);
    return this.#replaceCommonInfo(
      this.#htmlTemplate,
      unsubscribeLink,
      message,
    ).replace(/%MAIL_ASSETS_URL%/g, this.#mailAssetsUrl);
  }

  #getText(
    formattedDate: string,
    { publicationsByKeyword, unsubscribeLink }: PublicationsMessageDto,
  ) {
    const message =
      publicationsByKeyword.size === 0
        ? `Não houve publicações no Diário Oficial de São José do Rio Preto na data de ${formattedDate}`
        : this.#makePublicationsListText(formattedDate, publicationsByKeyword);
    return this.#replaceCommonInfo(
      this.#textTemplate,
      unsubscribeLink,
      message,
    );
  }

  #makePublicationsListHtml(
    formattedDate: string,
    publicationsByKeyword: Map<string, Publication[]>,
  ) {
    const keywordsList = [...publicationsByKeyword.entries()]
      .map(([keyword, publications]) => {
        const publicationsList = publications
          .map(({ code, link }) => `<li><a href="${link}">${code}</a></li>`)
          .join('');
        return `<li><b>${keyword}</b><ul>${publicationsList}</ul></li>`;
      })
      .join('');
    return `Segue a lista das publicações no Diário Oficial de São José do Rio Preto na data de <span>${formattedDate}</span><ul>${keywordsList}</ul>`;
  }

  #makePublicationsListText(
    formattedDate: string,
    publicationsByKeyword: Map<string, Publication[]>,
  ) {
    const keywordsList = [...publicationsByKeyword.entries()]
      .map(([keyword, publications]) => {
        const publicationsList = publications
          .map(({ link }) => `\t\t▪ ${link}`)
          .join('\n');
        return `\t• ${keyword}\n${publicationsList}`;
      })
      .join('\n');
    return `Segue a lista das publicações no Diário Oficial de São José do Rio Preto na data de ${formattedDate}\n\n${keywordsList}`;
  }
}
