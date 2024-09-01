import { Injectable, Logger } from '@nestjs/common';
import { DataService } from '../data.service';
import { Multer } from 'multer';
import { RedisService } from './redis.service';
import { SemaphoreService } from './semaphore.service';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(private readonly dataService: DataService,  private readonly redisService: RedisService, private readonly semaphoreService: SemaphoreService) {}

  // async uploadFile(file: Express.Multer.File, userId: number) {
  //   return this.dataService.addFile(file.filename, file.path, userId);
  // }

  async uploadFile(file: Express.Multer.File, userId: number) {
    this.semaphoreService.acquire(async () => {
      try {
        await this.dataService.addFile(file.filename, file.path, userId);
      } finally {
        this.semaphoreService.release();
        this.processQueue();
      }
    });
  }

  async processQueue() {
    const nextItem = await this.redisService.getNextInQueue();
    if (nextItem) {
      await this.uploadFile(nextItem.file, nextItem.userId);
    }
  }

  async queueFile(file: Express.Multer.File, userId: number) {
    await this.redisService.addToQueue(file, userId);
    this.logger.log(`File queued: ${file.filename} by user ${userId}`);
  }

  async getQueueLength() {
    return this.redisService.getQueueLength();
  }
  

  async getFilesByUser(userId: number) {
    this.logger.log(`File requested by user ${userId}`);
    return this.dataService.getUserFiles(userId);
  }

  async addCustomerToFile(fileId: number, customerData: any) {
    return this.dataService.addCustomer(customerData, fileId);
  }
}


// // server/src/services/file.service.ts
// import { Injectable } from '@nestjs/common';
// import { DataService } from '../data.service';


// @Injectable()
// export class FileService {
//   constructor(
//     private readonly dataService: DataService,
//     private readonly redisService: RedisService,
//     private readonly semaphoreService: SemaphoreService
//   ) {}

//   async uploadFile(file: Express.Multer.File, userId: number) {
//     this.semaphoreService.acquire(async () => {
//       try {
//         await this.dataService.addFile(file.filename, file.path, userId);
//       } finally {
//         this.semaphoreService.release();
//         this.processQueue();
//       }
//     });
//   }

//   async processQueue() {
//     const nextItem = await this.redisService.getNextInQueue();
//     if (nextItem) {
//       await this.uploadFile(nextItem.file, nextItem.userId);
//     }
//   }

//   async queueFile(file: Express.Multer.File, userId: number) {
//     await this.redisService.addToQueue(file, userId);
//   }
// }