// server/src/redis.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private client;

  constructor() {
    this.client = createClient({ url: 'redis://redis:6379' });
    this.client.connect().then(() => {
      console.log('Connected to Redis');
      this.resetProcessingCount();
    }).catch(err => {
      console.error('Redis connection error:', err);
    });
  }


  private async resetProcessingCount(): Promise<void> {
    try {
      await this.client.set('processingCount', 0);
      console.log('Processing count reset to 0');
    } catch (err) {
      console.error('Error resetting processing count:', err);
    }
  }


  async addToQueue(item: string) {
    await this.client.rPush('uploadQueue', item);
  }

  async getNextInQueue() {
    return this.client.lPop('uploadQueue');
  }

  async getQueueLength() {
    return this.client.lLen('uploadQueue');
  }

  async getProcessingCount() {
    const count = await this.client.get('processingCount');
    return count ? parseInt(count) : 0;
  }

  async incrementProcessingCount() {
    return this.client.incr('processingCount');
  }

  async decrementProcessingCount() {
    return this.client.decr('processingCount');
  }

}