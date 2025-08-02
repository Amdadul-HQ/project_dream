import {
  Body,
  Controller,
  Param,
  Post,
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

@ApiTags('Writer ---')
@Controller('writer/post')
@ApiBearerAuth()
@ValidateAuth()
export class WriterController {
  constructor(
    private readonly createPostService: CreatePostService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly updatePostService: UpdatePostService,
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
  async updatePost(
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedUrl;
    if (file) {
      uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(
        file.buffer,
        file.originalname,
      );
    }
    return this.updatePostService.updatePost(
      postId,
      dto,
      uploadedUrl?.url || undefined,
    );
  }

  //Writer all post
  async myPost() {}

  //writer delet post
  async deletePost() {}
}
