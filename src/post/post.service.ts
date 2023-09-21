import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async create(createPostDto: CreatePostDto, userId: string) {
    const newPost = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        published: createPostDto.published,
        publishDate: createPostDto.publishDate,
        authorId: userId,
      },
    });

    return newPost;
  }

  async findAll() {
    const posts = await this.prisma.post.findMany({});

    return posts;
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    return `This action updates a #${id} post`;
  }

  async remove(id: string, userId: string) {
    try {
      await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
