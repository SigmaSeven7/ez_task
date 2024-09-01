// server/src/redis.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private client;

  constructor() {
    this.client = createClient({ url: 'redis://redis:6379' });
    this.client.connect();
  }

  async addToQueue(file: Express.Multer.File, userId: number) {
    await this.client.rPush('uploadQueue', JSON.stringify({ file, userId }));
  }

  async getNextInQueue() {
    const item = await this.client.lPop('uploadQueue');
    return item ? JSON.parse(item) : null;
  }

  async getQueueLength() {
    return this.client.lLen('uploadQueue');
  }
}