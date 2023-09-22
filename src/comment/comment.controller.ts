import {
  Controller,
  Get,
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

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    return this.commentService.remove(id, userId);
  }
}
