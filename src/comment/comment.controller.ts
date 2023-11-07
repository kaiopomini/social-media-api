import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @GetCurrentUserId() userId: string,
    @Param('postId') postId: string,
  ) {
    return this.commentService.create(postId, createCommentDto, userId);
  }

  @Delete(':commentId')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('commentId') commentId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.commentService.remove(commentId, userId);
  }
}
