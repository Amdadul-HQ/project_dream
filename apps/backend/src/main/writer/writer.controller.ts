import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAuth } from '@project/common/jwt/jwt.decorator';

@ApiTags('Writer ---')
@Controller('writer/post')
@ApiBearerAuth()
@ValidateAuth()
export class WriterController {
  //create a post
  @Post()
  async createPost() {}

  //Update a post
  async updatePost() {}

  //Writer all post
  async myPost() {}

  //writer delet post
  async deletePost() {}
}
