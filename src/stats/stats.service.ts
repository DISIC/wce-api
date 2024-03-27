import { ProsodyService } from './../prosody/prosody.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
  constructor(private prosodyService: ProsodyService) {}
  async homePageStats() {
    try {
      const data = await this.prosodyService.getRealTimeStats();
      if (data.length > 1) {
        const mergedData = { conf: 0, part: 0 };
        for (let i = 0; i < data.length; i++) {
          mergedData.conf += data[i].conferences;
          mergedData.part += data[i].participants;
        }
        return mergedData;
      } else {
        return data[0];
      }
    } catch (error) {
      throw error;
    }
  }
}
