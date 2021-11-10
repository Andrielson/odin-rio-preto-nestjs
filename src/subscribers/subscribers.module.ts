import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SubscribersService } from './subscribers.service';

@Module({
  imports: [HttpModule, AuthModule],
  providers: [SubscribersService],
  exports: [SubscribersService],
})
export class SubscribersModule {}
