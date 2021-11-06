import { Publication } from 'src/publications/publication';

export class PublicationsMessageDto {
  #email: string;
  #publicationsByKeyword: Map<string, Publication[]>;
  #unsubscribeLink: string;

  constructor(
    email: string,
    publicationsByKeyword: Map<string, Publication[]>,
    unsubscribeLink: string,
  ) {
    this.#email = email;
    this.#publicationsByKeyword = publicationsByKeyword;
    this.#unsubscribeLink = unsubscribeLink;
  }

  get email() {
    return this.#email;
  }

  get publicationsByKeyword() {
    return this.#publicationsByKeyword;
  }

  get unsubscribeLink() {
    return this.#unsubscribeLink;
  }
}
