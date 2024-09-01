import { Injectable, Logger } from '@nestjs/common';
import { DataService } from '../data.service';
import { Multer } from 'multer';
import { RedisService } from './redis.service';
import { SemaphoreService } from './semaphore.service';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private processingCount = 0;
  private readonly MAX_CONCURRENT_UPLOADS = 5;
  constructor(private readonly dataService: DataService,  private readonly redisService: RedisService, private readonly semaphoreService: SemaphoreService) {}


  // async uploadFile(file: Express.Multer.File, userId: number) {
  //   try {
  //     this.logger.log(`Uploading file: ${file.filename} by user ${userId}`);
  //     await this.dataService.addFile(file.filename, file.path, userId);
  //     return { status: 'uploaded', file: file.filename };
  //   } catch (error) {
  //     this.logger.error(`Error uploading file: ${file.filename}`, error.stack);
  //     return { status: 'error', file: file.filename, error: error.message };
  //   } finally {
  //     await this.redisService.decrementProcessingCount();
  //     this.processNextInQueue();
  //   }
  // }

  async uploadFile(file: Express.Multer.File, userId: number) {
    try {
        this.logger.log(`Uploading file: ${file.filename} by user ${userId}`);
        await this.dataService.addFile(file.filename, file.path, userId);
        return { status: 'uploaded', file: file.filename };
    } catch (error) {
        this.logger.error(`Error uploading file: ${file.filename}`, error.stack);
        return { status: 'error', file: file.filename, error: error.message };
    } finally {
        // Wait for the processing count to be decremented before moving on
        await this.redisService.decrementProcessingCount();
        await this.processNextInQueue();
    }
}



  async queueFile(file: Express.Multer.File, userId: number) {
    const queueItem = JSON.stringify({ file: { filename: file.filename, path: file.path }, userId });
    await this.redisService.addToQueue(queueItem);
    this.logger.log(`File queued: ${file.filename} by user ${userId}`);
    return { status: 'queued', file: file.filename };
  }

  // private async processNextInQueue() {
  //   const processingCount = await this.redisService.getProcessingCount();
  //   if (processingCount < this.MAX_CONCURRENT_UPLOADS) {
  //     const nextItem = await this.redisService.getNextInQueue();
  //     if (nextItem) {
  //       try {
  //         const { file, userId } = JSON.parse(nextItem);
  //         await this.redisService.incrementProcessingCount();
  //         this.uploadFile(file, userId);
  //       } catch (error) {
  //         this.logger.error('Error processing queued item:', error);
  //         await this.redisService.decrementProcessingCount();
  //       }
  //     }
  //   }
  // }

  private async processNextInQueue() {
    const processingCount = await this.redisService.getProcessingCount();
    if (processingCount < this.MAX_CONCURRENT_UPLOADS) {
        const nextItem = await this.redisService.getNextInQueue();
        if (nextItem) {
            try {
                const { file, userId } = JSON.parse(nextItem);
                await this.redisService.incrementProcessingCount();
                await this.uploadFile(file, userId); // Await ensures the next process isn't started before the current one finishes
            } catch (error) {
                this.logger.error('Error processing queued item:', error);
                await this.redisService.decrementProcessingCount();
            }
        }
    }
}

  async getQueueLength() {
    return this.redisService.getQueueLength();
  }

  async getProcessingCount() {
    return this.redisService.getProcessingCount();
  }

  async decrementProcessingCount() {
    return this.redisService.decrementProcessingCount();
  }

  async incrementProcessingCount() {
    return this.redisService.incrementProcessingCount();
  }
  
  

  async getFilesByUser(userId: number) {
    this.logger.log(`File requested by user ${userId}`);
    console.log('File requested by user ${userId}');
    return this.dataService.getUserFiles(userId);
  }

  async addCustomerToFile(fileId: number, customerData: any) {
    return this.dataService.addCustomer(customerData, fileId);
  }

  async deleteFile(fileId: number) {
    this.logger.log(`File deletion requested for file ${fileId}`);
    console.log(`File deletion requested for file ${fileId}`);
    return this.dataService.deleteFile(fileId);
  }             
}
