import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { LikeService } from './service/like.service';
import { CommentService } from './service/comment.service';
import { FollowService } from './service/follow.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { CreateFollowDto } from './dto/createFollowee.dto';

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

  @ApiTags('User Like Post---')
  @Post('like/:postId')
  @ApiOperation({ summary: 'Post A Like' })
  async postLike(
    @Param('postId') postId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.likeService.likePost(postId, userId);
  }

  // Unlike a post
  @ApiTags('User Like Post---')
  @Delete('unlike/:postId')
  @ApiOperation({ summary: 'Unlike a post' })
  async unlikePost(
    @Param('postId') postId: string,
    @GetUser('userId') userId: string,
  ) {
    return await this.likeService.unlikePost(postId, userId);
  }

  // Post Comment
  @ApiTags('User Comment Post---')
  @Post()
  @ApiOperation({ summary: 'Create a new comment on a post' })
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser('userId') userId: string,
  ) {
    return this.commentService.createComment(createCommentDto, userId);
  }

  @ApiTags('User Comment Post---')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  // @UseGuards(AuthGuard('jwt'))
  async deleteComment(@Param('id') id: string) {
    const userId = 'some-authenticated-user-id';
    return this.commentService.deleteComment(id, userId);
  }

  //   User Follow
  @ApiTags('User Follow Writer---')
  @Post('follow')
  @ApiOperation({ summary: 'Follow a user' })
  // @UseGuards(AuthGuard('jwt'))
  async followUser(@Body() createFollowDto: CreateFollowDto) {
    const followerId = 'some-authenticated-user-id';
    return this.followService.followUser(
      followerId,
      createFollowDto.followeeId,
    );
  }
  @ApiTags('User Follow Writer---')
  @Delete('unfollow/:followeeId')
  @ApiOperation({ summary: 'Unfollow a user' })
  // @UseGuards(AuthGuard('jwt'))
  async unfollowUser(@Param('followeeId') followeeId: string) {
    const followerId = 'some-authenticated-user-id';
    return this.followService.unfollowUser(followerId, followeeId);
  }
}
