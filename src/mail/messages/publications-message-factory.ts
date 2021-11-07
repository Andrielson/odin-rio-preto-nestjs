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
    return this.#replaceCommonInfo(
      this.#htmlTemplate,
      unsubscribeLink,
      this.#getHtmlMessage(formattedDate, publicationsByKeyword),
    ).replace(/%MAIL_ASSETS_URL%/g, this.#mailAssetsUrl);
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

  #getText(
    formattedDate: string,
    { publicationsByKeyword, unsubscribeLink }: PublicationsMessageDto,
  ) {
    return this.#replaceCommonInfo(
      this.#textTemplate,
      unsubscribeLink,
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
