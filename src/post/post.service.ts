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

  async findAllFromUser(userId: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        likes: true,
        comments: true,
      },
    });
    return posts;
  }

  async findOne(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
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

  async remove(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
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
        id: postId,
      },
    });
  }

  async like(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.prisma.like.findFirst({
      where: {
        postId: postId,
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
          postId: postId,
        },
      });
    }
  }
}
