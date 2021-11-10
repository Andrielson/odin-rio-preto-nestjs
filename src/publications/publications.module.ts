import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';

@Module({
  imports: [HttpModule],
  providers: [PublicationsService],
  exports: [PublicationsService],
})
export class PublicationsModule {}
