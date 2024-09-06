import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { DataService } from './data.service';
import { RedisService } from './redis.service';


@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private processingCount = 0;
  private readonly MAX_CONCURRENT_UPLOADS = 1;


  constructor(private readonly dataService: DataService,  private readonly redisService: RedisService) {}

  
  async getFileContents(fileId: number) {
    this.logger.log(`Fetching contents for file ${fileId}`);
    try {
      const contents = await this.dataService.getFileContents(fileId);
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


async uploadFile(file: Express.Multer.File, userId: number, uploadId: any) {
  try {
    if (!file.originalname || !file.buffer || !userId) {
      throw new BadRequestException('Invalid file or user data');
    }
    const existingStatus = await this.redisService.getStatusQueue(userId.toString(), uploadId);
    
    if (existingStatus) {
      await this.redisService.updateStatusQueue(userId.toString(), uploadId, file.originalname, 'in-progress');
    } else {
      await this.redisService.addToStatusQueue(userId.toString(), uploadId, file.originalname, 'in-progress');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.dataService.addFile(file.originalname, file.buffer, userId);

    return { status: 'completed', file: file.originalname, uploadId, timestamp: new Date().toISOString() };
  } catch (error) {
    this.logger.error(`Error uploading file: ${file.originalname}`, error.stack);
    return { status: 'error', file: file.originalname, error: error.message };
  } finally {
    await this.redisService.updateStatusQueue(userId.toString(), uploadId, file.originalname, 'completed');
  }
}


async queueFile(file: Express.Multer.File, userId: number, uploadId: string) {
  await this.redisService.addToStatusQueue(userId.toString(), uploadId, file.originalname, 'queued');
  const queueItem = JSON.stringify({ file: { originalname: file.originalname, buffer: file.buffer }, userId, uploadId });
  await this.redisService.addToQueue(queueItem);
  return { status: 'queued', file: file.originalname, uploadId, timestamp: new Date().toISOString() };
}


async processNextInQueue() {
  const processingCount = await this.redisService.getProcessingCount();
  
  if (processingCount < this.MAX_CONCURRENT_UPLOADS) { 
    const nextItem = await this.redisService.getNextInQueue();
    if (nextItem) {
      try {
        await this.redisService.incrementProcessingCount(); 
        const { file, userId, uploadId } = JSON.parse(nextItem);
        await this.uploadFile(file, userId, uploadId );
      } catch (error) {
        this.logger.error('Error processing queued item:', error);
      } finally {
        await this.redisService.decrementProcessingCount();
      }
    }
  }
}


async processQueue() {
  this.logger.log('Starting queue processor');
  while (await this.redisService.getQueueLength() > 0) {
    try {
      await this.processNextInQueue();
    } catch (error) {
      this.logger.error('Error in queue processor:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  this.logger.log('Queue processing completed');
}


  async getQueueLength() {
    return this.redisService.getQueueLength();
  }

  async getProcessingCount() {
    return this.redisService.getProcessingCount();
  }


  async getFilesByUser(userId: number) {
    this.logger.log(`File requested by user ${userId}`);
    return this.dataService.getUserFiles(userId);
  }

  async addCustomerToFile(fileId: number, customerData: any) {
    return this.dataService.addCustomer(customerData, fileId);
  }

  async deleteFile(fileId: number) {
    this.logger.log(`File deletion requested for file ${fileId}`);
    return this.dataService.deleteFile(fileId);
  }             
}
