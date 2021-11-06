import { Module } from '@nestjs/common';
import { PublicationsModule } from 'src/publications/publications.module';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { Searcher } from './searcher';
import { SearchesService } from './searches.service';

@Module({
  imports: [PublicationsModule, SubscribersModule],
  providers: [SearchesService, Searcher],
  exports: [SearchesService],
})
export class SearchesModule {}
