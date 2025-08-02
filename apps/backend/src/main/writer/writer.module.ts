import { Module } from '@nestjs/common';
import { WriterController } from './writer.controller';
import { WriterService } from './service/writer.service';
import { CreatePostService } from './service/create-post.service';

@Module({
  controllers: [WriterController],
  providers: [WriterService, CreatePostService]
})
export class WriterModule {}
