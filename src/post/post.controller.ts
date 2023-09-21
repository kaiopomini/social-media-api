import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId, Public } from 'src/common/decorators';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createPostDto: CreatePostDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.postService.create(createPostDto, userId);
  }

  @Public()
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.postService.update(id, updatePostDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    return this.postService.remove(id, userId);
  }
}
