import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Tokens } from 'src/auth/types';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async signupLocal(createUserDto: CreateUserDto): Promise<Tokens> {
    const hasUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (hasUser) {
      throw new ForbiddenException('Access Denied');
    }

    const hash = await argon2.hash(createUserDto.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        hash: hash,
      },
    });

    const tokens = await this.authService.getTokens(newUser.id, newUser.email);

    await this.authService.updateRefreshTokenHash(
      newUser.id,
      tokens.refresh_token,
    );

    return tokens;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({});
    const returnUsers = users.map((user) => {
      delete user.hash;
      delete user.hashedRT;
      return user;
    });
    return returnUsers;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    delete user.hash;
    delete user.hashedRT;

    return user;
  }

  async update(
    userId: string,
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (userId != id) {
      throw new ForbiddenException('Access Denied');
    }
    let user = null;
    try {
      user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...updateUserDto,
        },
      });
    } catch (error) {
      throw new NotFoundException();
    }

    delete user.hash;
    delete user.hashedRT;

    return user;
  }

  async remove(userId: string, id: string) {
    if (userId != id) {
      throw new ForbiddenException('Access Denied');
    }

    try {
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
