import { PostStatus } from '@prisma/client';

export const createPostSwaggerSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      example: 'A Deep Dive into NestJS',
      description: 'The title of the post',
    },
    content: {
      type: 'object',
      example: {
        blocks: [
          { type: 'header', data: { text: 'Introduction' } },
          {
            type: 'paragraph',
            data: { text: 'This post will cover advanced NestJS topics.' },
          },
        ],
      },
      description: 'The content of the post in JSON format',
    },
    categoryIds: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uuid',
      },
      example: [
        '09876543-210e-dcba-9876-543210fedcba',
        'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      ],
      description: 'The IDs of the categories for the post',
    },
    seriesname: {
      type: 'string',
      example: 'Introduction to Node.js',
      description: 'The unique name of the series',
    },
    seriesId: {
      type: 'string',
      format: 'uuid',
      example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      description: 'The ID of the series this post belongs to',
    },
    status: {
      type: 'string',
      enum: Object.values(PostStatus),
      example: PostStatus.UNDER_REVIEW,
      description: 'The initial status of the post',
    },
    thumbnail: {
      type: 'string',
      format: 'binary',
    },
  },
  required: ['title', 'content', 'categoryIds', 'status', 'thumbnail'],
};
