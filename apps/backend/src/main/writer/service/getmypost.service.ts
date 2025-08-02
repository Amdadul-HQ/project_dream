import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { Post } from '@prisma/client';
import { GetPostsDto } from '../dto/getPost.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a paginated list of posts with filtering and searching capabilities.
   * @param query The DTO containing filter, search, and pagination parameters.
   * @returns A promise that resolves to an object containing the posts and total count.
   */
  async getMyAllPosts(
    writerId: string,
    query: GetPostsDto,
  ): Promise<{ posts: Post[]; total: number }> {
    const { search, category, writerName, seriesName, sortBy, page, limit } =
      query;

    const pageNumber = page ? parseInt(page, 10) : 1;
    const take = limit ? parseInt(limit, 10) : 10;
    const skip = (pageNumber - 1) * take;

    // Construct the dynamic WHERE clause
    const where: any = {};
    where.writerId = writerId;
    if (search) {
      // Search across post title, writer name, and series name
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { writer: { name: { contains: search, mode: 'insensitive' } } },
        { series: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (writerName) {
      where.writer = { name: { contains: writerName, mode: 'insensitive' } };
    }

    if (seriesName) {
      where.series = { name: { contains: seriesName, mode: 'insensitive' } };
    }

    if (category) {
      where.categories = {
        some: {
          name: { contains: category, mode: 'insensitive' },
        },
      };
    }

    // Construct the dynamic ORDER BY clause
    const orderBy: any = {};
    if (sortBy === 'likes') {
      orderBy.likeCount = 'desc';
    } else if (sortBy === 'views') {
      orderBy.viewCount = 'desc';
    } else {
      // Default sort is by creation date
      orderBy.createdAt = 'desc';
    }

    // Perform a count of all posts matching the filter
    const total = await this.prisma.post.count({ where });

    // Fetch the posts with pagination
    const posts = await this.prisma.post.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        writer: { select: { id: true, name: true, profile: true } },
        series: true,
        categories: true,
      },
    });

    return { posts, total };
  }
}
