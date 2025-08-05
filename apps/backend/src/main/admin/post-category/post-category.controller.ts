import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { PostCategoryService } from './service/post-category.service';
import { CreatePostCategoryDto } from './dto/createPostCategory.dto';

@ApiTags('Admin Post Category ---')
@Controller('admin/post-category')
@ApiBearerAuth()
@ValidateAdmin()
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  async createCategory(@Body() dto: CreatePostCategoryDto) {
    return this.postCategoryService.createPostCategory(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Category' })
  async getAllCategory() {
    return this.postCategoryService.getAllCategory();
  }
}
