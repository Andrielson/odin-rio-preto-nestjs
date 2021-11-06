export class Publication {
  #keyword: string;
  #code: string;
  #link: string;

  constructor(keyword: string, code: string, link: string) {
    this.#keyword = keyword;
    this.#code = code;
    this.#link = link;
  }

  get keyword() {
    return this.#keyword;
  }

  get code() {
    return this.#code;
  }

  get link() {
    return this.#link;
  }
}
