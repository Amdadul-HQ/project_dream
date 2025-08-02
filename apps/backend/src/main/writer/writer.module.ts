import { Module } from '@nestjs/common';
import { WriterController } from './writer.controller';
import { WriterService } from './service/writer.service';
import { CreatePostService } from './service/create-post.service';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { UpdatePostService } from './service/update-post.service';

@Module({
  controllers: [WriterController],
  providers: [
    WriterService,
    CreatePostService,
    CloudinaryService,
    UpdatePostService,
  ],
})
export class WriterModule {}
