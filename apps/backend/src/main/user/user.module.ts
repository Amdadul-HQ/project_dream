import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { LikeService } from './service/like.service';
import { CommentService } from './service/comment.service';
import { FollowService } from './service/follow.service';

@Module({
  controllers: [UserController],
  providers: [LikeService, CommentService, FollowService],
})
export class UserModule {}
