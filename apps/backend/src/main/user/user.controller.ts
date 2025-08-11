import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAuth } from '@project/common/jwt/jwt.decorator';
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
}
