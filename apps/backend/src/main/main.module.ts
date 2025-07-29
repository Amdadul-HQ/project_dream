import { Module } from '@nestjs/common';
import { WriterModule } from './writer/writer.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [WriterModule, AuthModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
