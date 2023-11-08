import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  c;

  async getFeedForPublic(): Promise<any[]> {
    const posts = await this.prisma.post.findMany({
      include: {
        owner: true,
        likes: true,
        comments: true,
      },
    });

    posts?.sort(
      (postA, postB) =>
        this.calculeRelevance(postB) - this.calculeRelevance(postA),
    );

    return posts;
  }

  async getFeedForUser(userId: string): Promise<any[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userFollowing: true,
      },
    });

    const posts = await this.prisma.post.findMany({
      include: {
        owner: true,
        likes: true,
        comments: true,
      },
    });

    // Ordene o feed por relevância (em ordem decrescente).
    posts?.sort(
      (postA, postB) =>
        this.calculeRelevance(postB, user) - this.calculeRelevance(postA, user),
    );

    return posts;
  }

  private calculeRelevance(post: any, user?: any) {
    let relevance = 0;

    relevance += post.likes.length * 0.3; // 0.30 pontos por cada like.
    relevance += post.comments.length * 0.2; // 0.20 pontos por cada comentário.

    // Calcule a idade do post em horas.
    const now: Date = new Date();
    const postCreatedAt: Date = new Date(post.createdAt);
    const hoursDifference: number =
      Math.abs(now.getTime() - postCreatedAt.getTime()) / (1000 * 60 * 60);

    if (hoursDifference <= 0.1) {
      relevance += 50;
    } else if (hoursDifference <= 0.2) {
      relevance += 45;
    } else if (hoursDifference <= 0.3) {
      relevance += 40;
    } else if (hoursDifference <= 0.4) {
      relevance += 35;
    } else if (hoursDifference <= 0.5) {
      relevance += 20;
    } else if (hoursDifference <= 0.6) {
      relevance += 15;
    } else if (hoursDifference <= 0.7) {
      relevance += 10;
    } else if (hoursDifference > 0.7) {
      // relevance -= Math.floor(hoursDifference / 240);
      relevance -= hoursDifference;
    }

    if (
      relevance >= 0 &&
      user?.userFollowing.some((followingUser: any) => {
        return followingUser.userFollowedId === post.ownerId;
      })
    ) {
      relevance *= 1.5;
    }

    return relevance;
  }
}
