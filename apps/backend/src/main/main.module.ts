import { Module } from '@nestjs/common';
import { WriterModule } from './writer/writer.module';
import { AuthModule } from './auth/auth.module';
import { PostCategoryModule } from './admin/post-category/post-category.module';
import { PostModule } from './admin/post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    WriterModule,
    AuthModule,
    PostCategoryModule,
    PostModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
