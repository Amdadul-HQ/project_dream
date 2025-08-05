import { Controller, Get, Query } from '@nestjs/common';
import { AllPostService } from './service/all-post.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { GetAllPostsDto } from './dto/getAllPost.dto';

@ApiTags('Admin Post ---')
@Controller('admin/posts')
@ApiBearerAuth()
@ValidateAdmin()
export class PostController {
  constructor(private readonly allPost: AllPostService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all posts with filters and pagination',
  })
  async posts(@Query() query: GetAllPostsDto) {
    return this.allPost.getAllPosts(query);
  }
}
