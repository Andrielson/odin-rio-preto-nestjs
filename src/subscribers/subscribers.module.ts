import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';

@Module({
  imports: [HttpModule],
  providers: [SubscribersService],
  exports: [SubscribersService]
})
export class SubscribersModule {}
