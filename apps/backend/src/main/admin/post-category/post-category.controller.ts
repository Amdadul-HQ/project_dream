import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { PostCategoryService } from './service/post-category.service';
import { CreatePostCategoryDto } from './dto/createPostCategory.dto';

@ApiTags('Admin Post Category ---')
@Controller('admin/post-category')
@ApiBearerAuth()
@ValidateAuth()
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  async createCategory(@Body() dto: CreatePostCategoryDto) {
    return this.postCategoryService.createPostCategory(dto);
  }
}
