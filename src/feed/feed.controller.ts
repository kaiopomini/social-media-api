import { Controller, Get } from '@nestjs/common';
import { FeedService } from './feed.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId, Public } from 'src/common/decorators';

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('my-feed')
  @ApiBearerAuth('access-token')
  getFeedForUser(@GetCurrentUserId() userId: string) {
    return this.feedService.getFeedForUser(userId);
  }

  @Get('public')
  @Public()
  getFeedForPublic() {
    return this.feedService.getFeedForPublic();
  }
}
