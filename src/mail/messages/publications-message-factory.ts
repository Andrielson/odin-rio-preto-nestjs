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
    const keywordsList = [...publicationsByKeyword.entries()]
      .map(([keyword, publications]) => {
        const keywordResult =
          publications.length === 0
            ? `: <i>não houve publicações com este termo.</i>`
            : this.#makePublicationsListHtml(publications);
        return `<li><b>${keyword}</b>${keywordResult}</li>`;
      })
      .join('');
    const message = `Segue a lista das publicações no Diário Oficial de São José do Rio Preto na data de <span>${formattedDate}</span><ul>${keywordsList}</ul>`;
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
    const keywordsList = [...publicationsByKeyword.entries()]
      .map(([keyword, publications]) => {
        const keywordResult =
          publications.length === 0
            ? `: não houve publicações com este termo.`
            : `\n${this.#makePublicationsListText(publications)}`;
        return `\t• ${keyword}${keywordResult}`;
      })
      .join('\n');
    const message = `Segue a lista das publicações no Diário Oficial de São José do Rio Preto na data de ${formattedDate}\n\n${keywordsList}`;
    return this.#replaceCommonInfo(
      this.#textTemplate,
      unsubscribeLink,
      message,
    );
  }

  #makePublicationsListHtml(publications: Publication[]) {
    const listItems = publications
      .map(({ code, link }) => `<li><a href="${link}">${code}</a></li>`)
      .join('');
    return `<ul>${listItems}</ul>`;
  }

  #makePublicationsListText(publications: Publication[]) {
    return publications.map(({ link }) => `\t\t▪ ${link}`).join('\n');
  }
}
