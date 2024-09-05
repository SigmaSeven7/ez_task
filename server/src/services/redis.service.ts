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

  // async getProcessingCount() {
  //   // const count = await this.client.get('processingCount');
  //   // return count ? parseInt(count) : 0;
  //   const count = (await this.getProcessingQueue()).length;
  //   return count;
  // }

  // async getProcessingCount(): Promise<number> {
  //   return this.client.lLen('processingQueue');
  // }

  // async incrementProcessingCount() {
  //   return this.client.incr('processingCount');
  // }

  // async decrementProcessingCount() {
  //   return this.client.decr('processingCount');
  // }


  async getFullQueue(): Promise<string[]> {
    try {
      const items = await this.client.lRange('uploadQueue', 0, -1);
      return items;
    } catch (err) {
      console.error('Error fetching upload queue:', err);
      throw err;
    }
  }

  async incrementProcessingCount() {
    await this.client.incr('processingCount');
    console.log('Incremented processing count');
  }
  
  async decrementProcessingCount() {
    await this.client.decr('processingCount');
    console.log('Decremented processing count');
  }

  async addToProcessingQueue(item: string) {
    await this.client.rPush('processingQueue', item);
    console.log(`Added item to processing queue`);
  }

  async removeFromProcessingQueue(item: string) {
    const result = await this.client.lRem('processingQueue', 0, item);
    console.log(`Removed item from processing queue:, Result: ${result}`);
  }

  async getProcessingQueue(): Promise<string[]> {
    const items = await this.client.lRange('processingQueue', 0, -1);
    console.log('Current processing queue:');
    return items;
  }

  async getProcessingCount(): Promise<number> {
    // const processingQueue = await this.getProcessingQueue();
    // return processingQueue.length;
    const count = await this.client.get('processingCount');
    return count ? parseInt(count) : 0;
  }

}