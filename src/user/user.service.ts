import {
  Injectable,
  NotFoundException,
  BadRequestException,
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
      throw new BadRequestException('User already exists');
    }

    const hash = await argon2.hash(createUserDto.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        profile: {
          create: {
            bio: '',
          },
        },
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

  async findAll(
    name: string,
    email: string,
    page = 1,
    perPage = 100,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  }> {
    const where: any = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (email) {
      where.email = {
        contains: email,
        mode: 'insensitive',
      };
    }
    const users = await this.prisma.user.findMany({
      where,
      skip: (+page - 1) * +perPage,
      take: +perPage,
      include: {
        profile: true,
        userFollowed: true,
        userFollowing: true,
      },
    });
    const totalUsers = await this.prisma.user.count({ where });
    const totalPages = Math.ceil(totalUsers / +perPage);

    const returnUsers = users.map((user) => {
      delete user.hash;
      delete user.hashedRT;
      return user;
    });
    return { data: returnUsers, total: totalUsers, page, perPage, totalPages };
  }

  async findOne(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
        profile: true,
        userFollowed: true,
        userFollowing: true,
        comments: true,
        likes: true,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    delete user.hash;
    delete user.hashedRT;

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    let user = null;
    try {
      user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: updateUserDto.name,
          profile: {
            update: {
              bio: updateUserDto.bio,
            },
          },
        },
        include: {
          profile: true,
        },
      });
    } catch (error) {
      throw new NotFoundException();
    }

    delete user.hash;
    delete user.hashedRT;

    return user;
  }

  async remove(userId: string) {
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

  async toggleFollow(userId: string, userToFollowId: string) {
    if (userId === userToFollowId) {
      throw new BadRequestException("You can't follow yourself");
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingFollow = await this.prisma.follow.findFirst({
      where: {
        userFollowingId: userId,
        userFollowedId: userToFollowId,
      },
    });

    if (existingFollow) {
      await this.prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      await this.prisma.follow.create({
        data: {
          userFollowingId: userId,
          userFollowedId: userToFollowId,
        },
      });
    }
  }
}
