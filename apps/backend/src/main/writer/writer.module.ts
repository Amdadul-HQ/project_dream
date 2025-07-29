import { Module } from '@nestjs/common';
import { WriterController } from './writer.controller';
import { WriterService } from './service/writer.service';

@Module({
  controllers: [WriterController],
  providers: [WriterService]
})
export class WriterModule {}
