import {
  Body,
  Controller,
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
import { ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { createPostSwaggerSchema } from './dto/createPost.swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/createPost.dto';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { CreatePostService } from './service/create-post.service';

@ApiTags('Writer ---')
@Controller('writer/post')
@ApiBearerAuth()
@ValidateAuth()
export class WriterController {
  constructor(
    private readonly createPostService: CreatePostService,
    private readonly cloudinaryService: CloudinaryService,
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
  ) {
    let uploadedUrl;
    if (file) {
      uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(
        file.buffer,
        file.originalname,
      );
    }
    return this.createPostService.createPost(dto, uploadedUrl?.url);
  }

  //Update a post
  async updatePost() {}

  //Writer all post
  async myPost() {}

  //writer delet post
  async deletePost() {}
}
