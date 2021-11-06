import { Injectable } from '@nestjs/common';
import { SearchesService } from './searches/searches.service';

@Injectable()
export class AppService {
  #searchService: SearchesService;
  constructor(searchService: SearchesService) {
    this.#searchService = searchService;
  }
  doIt(date: Date) {
    return this.#searchService.searchByDate(date);
  }
}
