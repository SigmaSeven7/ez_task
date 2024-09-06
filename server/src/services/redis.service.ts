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
      this.scheduleCleanOldStatusQueueItems();
    }).catch(err => {
      console.error('Redis connection error:', err);
    });
  }

  async cleanOldStatusQueueItems() {
    try {
      const statusQueue = await this.client.hGetAll('statusQueue');
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  
      for (const [key, value] of Object.entries(statusQueue)) {
        const statusData = JSON.parse(value as string);
        const timestamp = new Date(statusData.timestamp).getTime();
  
        if (statusData.status === 'completed' && timestamp < tenMinutesAgo) {
          await this.client.hDel('statusQueue', key);
        }
      }
    } catch (error) {
      console.error('Error cleaning old status queue items:', error);
    }
  }

  scheduleCleanOldStatusQueueItems() {
    setInterval(() => {
      this.cleanOldStatusQueueItems();
    }, 60 * 60 * 1000); 
  }


  private async resetProcessingCount(): Promise<void> {
    try {
      await this.client.set('processingCount', 0);
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

  
  async incrementProcessingCount() {
    await this.client.incr('processingCount');
  }
  
  async decrementProcessingCount() {
    await this.client.decr('processingCount');
  }

  async addToStatusQueue(userId: string, uploadId: string, fileName: string, status: string) {
    const statusData = this.createStatusData(fileName, status);
    const userStatusKey = `statusQueue:${userId}`;
    await this.client.hSet(userStatusKey, uploadId, JSON.stringify(statusData));
  }
  
  async updateStatusQueue(userId: string, uploadId: string, fileName: string, status: string) {
    const userStatusKey = `statusQueue:${userId}`;
    const currentStatus = await this.client.hGet(userStatusKey, uploadId);
    if (currentStatus) {
      const updatedStatus = this.createStatusData(fileName, status);
      await this.client.hSet(userStatusKey, uploadId, JSON.stringify(updatedStatus));
    }
  }
  
  async removeItemFromStatusQueue(userId: string, uploadId: string): Promise<void> {
    const userStatusKey = `statusQueue:${userId}`;
    await this.client.hDel(userStatusKey, uploadId);
  }

  private createStatusData(fileName: string, status: string) {
    return { fileName, status, timestamp: new Date().toISOString() };
  }

  async getStatusQueue(userId: string, uploadId: string): Promise<any> {
    const userStatusKey = `statusQueue:${userId}`;
    const status = await this.client.hGet(userStatusKey, uploadId);   
    if (status) {
      return JSON.parse(status);
    } else {
      return null;
    }
  }
  async getProcessingCount(): Promise<number> {
    const count = await this.client.get('processingCount');
    return count ? parseInt(count) : 0;
  }
}