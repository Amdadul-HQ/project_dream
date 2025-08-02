import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';

export class GetPostsDto {
  @ApiProperty({
    description: 'Search term for post title, writer name, or series name',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter posts by category name',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Filter posts by writer name',
    required: false,
  })
  @IsOptional()
  @IsString()
  writerName?: string;

  @ApiProperty({
    description: 'Filter posts by series name',
    required: false,
  })
  @IsOptional()
  @IsString()
  seriesName?: string;

  @ApiProperty({
    description: 'Sort posts by "views" or "likes"',
    enum: ['views', 'likes'],
    required: false,
  })
  @IsOptional()
  @IsIn(['views', 'likes'])
  sortBy?: 'views' | 'likes';

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
