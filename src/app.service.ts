import { Injectable } from '@nestjs/common';
import { SearchService } from './search/search.service';

@Injectable()
export class AppService {
  #searchService: SearchService;

  constructor(searchService: SearchService) {
    this.#searchService = searchService;
  }

  searchAndNotify(date: Date) {
    return this.#searchService.searchByDate(date);
  }
}
