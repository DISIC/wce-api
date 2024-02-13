import { StatsService } from './stats.service';
import { Controller, Get } from '@nestjs/common';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('/homePage')
  async homePageStats() {
    return this.statsService.homePageStats();
  }
}
