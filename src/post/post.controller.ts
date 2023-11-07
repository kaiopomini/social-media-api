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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId, Public } from 'src/common/decorators';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createPostDto: CreatePostDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.postService.create(createPostDto, userId);
  }

  @Public()
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  findAllFromUser(@Param('userId') userId: string) {
    return this.postService.findAllFromUser(userId);
  }

  @Public()
  @Get(':postId')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('postId') postId: string) {
    return this.postService.findOne(postId);
  }

  @Delete(':postId')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('postId') postId: string, @GetCurrentUserId() userId: string) {
    return this.postService.remove(postId, userId);
  }

  @Post('like/:postId')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  like(@Param('postId') postId: string, @GetCurrentUserId() userId: string) {
    return this.postService.like(postId, userId);
  }
}
