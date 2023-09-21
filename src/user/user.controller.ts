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
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { Tokens } from 'src/auth/types';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('local/signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.userService.signupLocal(dto);
  }

  @Get()
  @Public()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  update(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  remove(@GetCurrentUserId() userId: string, @Param('id') id: string) {
    return this.userService.remove(userId, id);
  }
}
