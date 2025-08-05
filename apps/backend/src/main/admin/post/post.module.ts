import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { AllPostService } from './service/all-post.service';

@Module({
  controllers: [PostController],
  providers: [AllPostService],
})
export class PostModule {}
