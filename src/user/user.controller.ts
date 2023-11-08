import {
  Controller,
  Get,
  Post,
  Body,
  Query,
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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

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
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  findAll(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('page') page = 1, // Default value for page
    @Query('perPage') perPage = 100,
  ) {
    return this.userService.findAll(name, email, +page, +perPage);
  }

  @Patch('self')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  update(
    @GetCurrentUserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete('self')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  remove(@GetCurrentUserId() userId: string) {
    return this.userService.remove(userId);
  }

  @Post('toggleFollow/:id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  toggleFollow(@GetCurrentUserId() userId: string, @Param('id') id: string) {
    return this.userService.toggleFollow(userId, id);
  }

  @Get('self')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  getMe(@GetCurrentUserId() userId: string) {
    return this.userService.findOne(userId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
}
