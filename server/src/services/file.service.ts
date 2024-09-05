import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { DataService } from '../data.service';
import { Multer } from 'multer';
import { RedisService } from './redis.service';
import { SemaphoreService } from './semaphore.service';
import { FileUploadGateway } from '../FileUploadGateway';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private processingCount = 0;
  private readonly MAX_CONCURRENT_UPLOADS = 3;
  @Inject(FileUploadGateway) private readonly fileUploadGateway: FileUploadGateway
  constructor(private readonly dataService: DataService,  private readonly redisService: RedisService, private readonly semaphoreService: SemaphoreService) {}

  
  async getFileContents(fileId: number) {
    this.logger.log(`Fetching contents for file ${fileId}`);
    try {
      const contents = await this.dataService.getFileContents(fileId);
      console.log('contents', contents);
      return contents;
    } catch (error) {
      this.logger.error(`Error fetching file contents for file ${fileId}:`, error.stack);
      throw error;
    }
  }
  
  async getFile(fileId: number) {
    this.logger.log(`Fetching file info for file ${fileId}`);
    return this.dataService.getFile(fileId);
  }

//   async uploadFile(file: Express.Multer.File, userId: number) {
//     try {
//         this.logger.log(`Uploading file: ${file.filename} by user ${userId}`);
//         await this.dataService.addFile(file.filename, file.path, userId);
//         return { status: 'uploaded', file: file.filename };
//     } catch (error) {
//         this.logger.error(`Error uploading file: ${file.filename}`, error.stack);
//         return { status: 'error', file: file.filename, error: error.message };
//     } finally {
//         // Wait for the processing count to be decremented before moving on
//         await this.redisService.decrementProcessingCount();
//         await this.processNextInQueue();
//     }
// }



//   async queueFile(file: Express.Multer.File, userId: number) {
//     const queueItem = JSON.stringify({ file: { filename: file.filename, path: file.path }, userId });
//     await this.redisService.addToQueue(queueItem);
//     this.logger.log(`File queued: ${file.filename} by user ${userId}`);
//     return { status: 'queued', file: file.filename };
//   }

// async uploadFile(file: Express.Multer.File, userId: number) {
//   try {
//     if (!file.originalname || !file.buffer || !userId) 
//             throw new BadRequestException('Invalid file or user data');

//     // await this.redisService.incrementProcessingCount();
//     await this.redisService.addToProcessingQueue(JSON.stringify({ file: { originalname: file.originalname, buffer: file.buffer }, userId }));
//     await this.dataService.addFile(file.originalname, file.buffer, userId);

//     return { status: 'uploaded', file: file.originalname };
//   } catch (error) {

//     this.logger.error(`Error uploading file: ${file.originalname}`, error.stack);
//     // await this.redisService.decrementProcessingCount();

//     return { status: 'error', file: file.originalname, error: error.message };
//   } finally {

//     // await this.redisService.decrementProcessingCount();
//     await this.redisService.removeFromProcessingQueue(JSON.stringify({ file: { originalname: file.originalname, buffer: file.buffer }, userId }));
//     await this.processNextInQueue();
//   }
// }


async uploadFile(file: Express.Multer.File, userId: number) {
  try {
    if (!file.originalname || !file.buffer || !userId) {
      throw new BadRequestException('Invalid file or user data');
    }

    // Increment the processing count

    // Add the file to the processing queue
    console.log(`Adding file to processing queue: ${file.originalname}`);
    await this.redisService.addToProcessingQueue(JSON.stringify({ file: { originalname: file.originalname, buffer: file.buffer }, userId }));
    await this.redisService.incrementProcessingCount();
    // Simulate file processing delay (e.g., 5 seconds)
    console.log(`Processing file: ${file.originalname}`);
  

    // Process the file (e.g., upload to storage, database, etc.)
    await this.dataService.addFile(file.originalname, file.buffer, userId);

    return { status: 'uploaded', file: file.originalname };
  } catch (error) {
    this.logger.error(`Error uploading file: ${file.originalname}`, error.stack);
    return { status: 'error', file: file.originalname, error: error.message };
  } finally {
    // Remove the file from the processing queue after it's done processing
    console.log(`Removing file from processing queue: ${file.originalname}`);
    await this.redisService.removeFromProcessingQueue(JSON.stringify({ file: { originalname: file.originalname, buffer: file.buffer }, userId }));
    await this.redisService.decrementProcessingCount();
    // Decrement the processing count
    // Process the next file in the queue (if any)
    await this.processNextInQueue();
  }
}


async queueFile(file: Express.Multer.File, userId: number) {
  const queueItem = JSON.stringify({ file: { originalname: file.originalname, buffer: file.buffer }, userId });
  await this.redisService.addToQueue(queueItem);
  // this.logger.log(`File queued: ${file.originalname} by user ${userId}`);
  return { status: 'queued', file: file.originalname };
}

private async processNextInQueue() {
  const processingCount = await this.redisService.getProcessingCount();
  console.log('processingCount', processingCount);
  if (processingCount < this.MAX_CONCURRENT_UPLOADS) {
    const nextItem = await this.redisService.getNextInQueue();
    if (nextItem) {
      try {
        const { file, userId } = JSON.parse(nextItem);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.uploadFile(file, userId); 
      } catch (error) {
        this.logger.error('Error processing queued item:', error);
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

  // async decrementProcessingCount() {
  //   return this.redisService.decrementProcessingCount();
  // }

  // async incrementProcessingCount() {
  //   return this.redisService.incrementProcessingCount();
  // }
  
  

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
