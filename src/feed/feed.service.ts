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
    const LOG_BASE = 10; // Base do logaritmo, você pode ajustar conforme necessário.
    let relevance = 0;

    // Calcule a idade do post em milissegundos.
    const now: Date = new Date();
    const postCreatedAt: Date = new Date(post.createdAt);
    const millisecondsDifference: number = Math.abs(
      now.getTime() - postCreatedAt.getTime(),
    );

    // Calcule a relevância baseada na idade usando logaritmo.
    const ageRelevance =
      Math.log10(millisecondsDifference + 1) / Math.log10(LOG_BASE);

    // Calcule a relevância das curtidas e comentários usando logaritmo.
    relevance += (Math.log10(post.likes.length + 1) / Math.log10(LOG_BASE)) * 1;
    relevance +=
      (Math.log10(post.comments.length + 1) / Math.log10(LOG_BASE)) * 1;

    // Some os componentes de relevância.
    relevance += ageRelevance;

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
