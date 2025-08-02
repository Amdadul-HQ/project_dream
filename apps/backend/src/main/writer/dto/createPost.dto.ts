import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'A Deep Dive into NestJS',
    required: true,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({
    description: 'The content of the post in JSON format',
    example: {
      blocks: [
        { type: 'header', data: { text: 'Introduction' } },
        {
          type: 'paragraph',
          data: { text: 'This post will cover advanced NestJS topics.' },
        },
      ],
    },
    required: true,
  })
  @IsNotEmpty({ message: 'Content is required' })
  content: any; // Use 'any' since JSON structure can be dynamic

  @ApiProperty({
    description: 'Writer Id',
    example: '09876543-210e-dcba-9876-543210fedcba',
    required: true,
  })
  @IsNotEmpty({ message: 'Writer Id must be givien' })
  @IsUUID()
  writerId: string;

  @ApiProperty({
    description: 'The IDs of the categories for the post',
    example: [
      '09876543-210e-dcba-9876-543210fedcba',
      'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    ],
    required: true,
  })
  @IsNotEmpty({ message: 'At least one category ID is required' })
  @IsArray({ message: 'Category IDs must be an array' })
  @ArrayMinSize(1, { message: 'At least one category ID is required' })
  @IsUUID('4', { each: true, message: 'Each category ID must be a valid UUID' })
  categoryIds: string[];

  @ApiProperty({
    description: 'The unique name of the series',
    example: 'Introduction to Node.js',
    required: true,
  })
  @IsOptional()
  @IsString({ message: 'Series Name must be a string' })
  seriesname?: string;

  @ApiProperty({
    description: 'The ID of the series this post belongs to',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Series ID must be a valid UUID' })
  seriesId?: string;
}
