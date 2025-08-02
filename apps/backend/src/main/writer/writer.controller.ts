import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { createPostSwaggerSchema } from './dto/createPost.swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/createPost.dto';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { CreatePostService } from './service/create-post.service';
import { UpdatePostService } from './service/update-post.service';
import { UpdatePostDto } from './dto/updatePost.dto';
import { updatePostSwaggerSchema } from './dto/updatePost.swagger';
import { AppError } from '@project/common/error/handle-error.app';
import { GetPostsDto } from './dto/getPost.dto';
import { PostsService } from './service/getmypost.service';

@ApiTags('Writer ---')
@Controller('writer/post')
@ApiBearerAuth()
@ValidateAuth()
export class WriterController {
  constructor(
    private readonly createPostService: CreatePostService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly updatePostService: UpdatePostService,
    private readonly postsService: PostsService,
  ) {}

  //create a post
  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Post creation form data with image',
    schema: {
      type: 'object',
      properties: {
        ...createPostSwaggerSchema.properties,
      },
    },
  })
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createPost(
    @Body() dto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser('userId') userId: string,
  ) {
    let uploadedUrl;
    if (file) {
      uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(
        file.buffer,
        file.originalname,
      );
    }
    dto.writerId = userId;
    return this.createPostService.createPost(dto, uploadedUrl?.url);
  }

  //Update a post
  @Patch(':postId')
  @ApiOperation({ summary: 'Updated a post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Post update form data with image',
    schema: {
      type: 'object',
      properties: {
        ...updatePostSwaggerSchema.properties,
      },
    },
  })
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updatePost(
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser('userId') userId: string,
  ) {
    if (!userId) {
      throw new AppError(500, 'User id invalied!!!');
    }
    let uploadedUrl;
    if (file) {
      uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(
        file.buffer,
        file.originalname,
      );
    }
    dto.writerId = userId;
    return this.updatePostService.updatePost(
      postId,
      dto,
      uploadedUrl?.url || undefined,
    );
  }

  //Writer all post
  @Get('my-posts')
  @ApiOperation({
    summary: 'Get all posts by a specific writer with filters and pagination',
  })
  async myPost(
    @GetUser('userId') writerId: string,
    @Query() query: GetPostsDto,
  ) {
    return this.postsService.getMyAllPosts(writerId, query);
  }

  //writer delet post
  async deletePost() {}
}
