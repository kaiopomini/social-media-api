import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ) {
    // Verifique se o post existe
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const newComment = await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        postId: postId,
        ownerId: userId,
      },
    });

    return newComment;
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: string) {
    return `This action returns a #${id} comment`;
  }

  async remove(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.ownerId !== userId) {
      throw new ForbiddenException("You're not the owner of this comment");
    }

    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
