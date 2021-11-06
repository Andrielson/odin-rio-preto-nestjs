export class Subscriber {
  #email: string;
  #keywords: string[];
  #unsubscribeLink: string;

  constructor(email: string, keywords: string[], unsubscribeLink: string) {
    this.#email = email;
    this.#keywords = keywords;
    this.#unsubscribeLink = unsubscribeLink;
  }

  get email() {
    return this.#email;
  }

  get keywords() {
    return this.#keywords;
  }

  get unsubscribeLink() {
    return this.#unsubscribeLink;
  }
}
