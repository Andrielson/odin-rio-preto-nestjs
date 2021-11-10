import { Injectable, Logger } from '@nestjs/common';
import { MailMessage } from 'src/mail/interfaces/mail-message.interface';
import { PublicationsMessageDto } from './publications-message-dto.interface';
import { PublicationsMessageHtmlService } from './publications-message-html/publications-message-html.service';
import { PublicationsMessageTextService } from './publications-message-text/publications-message-text.service';

@Injectable()
export class PublicationsMessageService {
  readonly #logger = new Logger(PublicationsMessageService.name);
  readonly #htmlService: PublicationsMessageHtmlService;
  readonly #textService: PublicationsMessageTextService;

  constructor(
    htmlService: PublicationsMessageHtmlService,
    textService: PublicationsMessageTextService,
  ) {
    this.#htmlService = htmlService;
    this.#textService = textService;
  }

  getMessage(
    date: Date,
    { email, publicationsByKeyword, unsubscribeLink }: PublicationsMessageDto,
  ) {
    const formattedDate = this.#formatDate(date);
    return Object.freeze<MailMessage>({
      html: this.#htmlService.getHtml(
        formattedDate,
        publicationsByKeyword,
        unsubscribeLink,
      ),
      subject: `Publicações do dia ${formattedDate}`,
      text: this.#textService.getText(
        formattedDate,
        publicationsByKeyword,
        unsubscribeLink,
      ),
      to: email,
    });
  }

  #formatDate(date: Date) {
    const searchValue = /(\d{4})-(\d{2})-(\d{2}).*/;
    const replaceValue = '$3/$2/$1';
    return date.toISOString().replace(searchValue, replaceValue);
  }
}
