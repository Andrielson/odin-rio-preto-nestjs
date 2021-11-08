import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';

const isGlobal = true;

@Module({
  imports: [ConfigModule.forRoot({ isGlobal }), SearchModule],
  providers: [AppService],
})
export class AppModule {}
