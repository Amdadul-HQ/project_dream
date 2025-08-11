import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { LikeService } from './service/like.service';
import { CommentService } from './service/comment.service';
import { FollowService } from './service/follow.service';

@ApiTags('User ---')
@Controller('user/post')
@ApiBearerAuth()
@ValidateAuth()
export class UserController {
  constructor(
    private readonly likeService: LikeService,
    private readonly commentService: CommentService,
    private readonly followService: FollowService,
  ) {}

  @Post('like/:postId')
  @ApiOperation({ summary: 'Post A Like' })
  async postLike(
    @Param('postId') postId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.likeService.likePost(postId, userId);
  }

  // Unlike a post
  @Delete('unlike/:postId')
  @ApiOperation({ summary: 'Unlike a post' })
  async unlikePost(
    @Param('postId') postId: string,
    @GetUser('userId') userId: string,
  ) {
    return await this.likeService.unlikePost(postId, userId);
  }
}
