import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { registerUserSwaggerSchema } from './dto/registration.swagger';
import { RegisterUserDto } from './dto/auth.dto';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';

@ApiTags('Auth ---')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('registration')
  @ApiOperation({ summary: 'User Registration' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ...registerUserSwaggerSchema.properties,
        profile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profile'))
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(registerUserDto, 'body');
    console.log(file, 'file');
    let uploadedUrl: any = null;

    if (file) {
      uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(
        file.buffer,
        file.originalname,
      );
    }
    return await this.authService.register(
      registerUserDto,
      uploadedUrl?.url || null,
    );
  }
}
