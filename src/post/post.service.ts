import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async create(createPostDto: CreatePostDto, userId: string) {
    const newPost = await this.prisma.post.create({
      data: {
        content: createPostDto.content,
        ownerId: userId,
      },
    });

    return newPost;
  }

  async findAll() {
    const posts = await this.prisma.post.findMany({
      include: {
        likes: true,
        comments: true,
      },
    });
    return posts;
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        likes: true,
        comments: true,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (post.ownerId !== userId) {
      throw new ForbiddenException("You're not the owner of this post");
    }

    await this.prisma.post.delete({
      where: {
        id: id,
      },
    });
  }

  async like(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.prisma.like.findFirst({
      where: {
        postId: id,
        userId: userId,
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await this.prisma.like.create({
        data: {
          userId: userId,
          postId: id,
        },
      });
    }
  }
}
