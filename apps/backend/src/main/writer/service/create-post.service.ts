import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreatePostDto } from '../dto/createPost.dto';
import { Post, Series } from '@prisma/client';

@Injectable()
export class CreatePostService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new post.
   * If a seriesName is provided, a new series is created first within a transaction.
   * If a seriesId is provided, the post is added to the existing series.
   * A unique part number is automatically assigned within the series.
   * @param createPostDto The DTO for post creation.
   * @returns The newly created Post object.
   */
  async createPost(
    createPostDto: CreatePostDto,
    thumbnail: string,
  ): Promise<Post> {
    // Destructure writerId separately to use with Prisma's connect syntax
    const { seriesId, seriesname, categoryIds, writerId, ...postData } =
      createPostDto;

    // Use a Prisma transaction to ensure atomicity for creating the series and the post.
    return this.prisma.$transaction(async (tx) => {
      let postSeriesId: string | undefined;
      let nextPartNumber: number | undefined;

      // Logic to handle series creation or linking to an existing one
      if (seriesname) {
        if (seriesId) {
          throw new BadRequestException(
            'Cannot provide both a new seriesName and an existing seriesId.',
          );
        }
        // Create a new series and get its ID
        const newSeries: Series = await tx.series.create({
          data: {
            name: seriesname,
          },
        });
        postSeriesId = newSeries.id;
        nextPartNumber = 1; // The first post in a new series is always part 1.
      } else if (seriesId) {
        // If an existing seriesId is provided, find the next available part number.
        const lastPostInSeries = await tx.post.findFirst({
          where: { seriesId: seriesId },
          orderBy: { part: 'desc' },
        });

        // The part number is the last part + 1, or 1 if it's the first post.
        nextPartNumber = (lastPostInSeries?.part ?? 0) + 1;

        postSeriesId = seriesId;
      }

      // Connect to categories for the many-to-many relationship
      const categoriesToConnect = categoryIds.map((id) => ({ id }));

      // Create the post with the appropriate series connection and part number.
      return await tx.post.create({
        data: {
          ...postData,
          thumbnail,
          writer: {
            connect: {
              id: writerId,
            },
          },
          series: postSeriesId ? { connect: { id: postSeriesId } } : undefined,
          categories: { connect: categoriesToConnect },
          part: nextPartNumber,
        },
      });
    });
  }
}
