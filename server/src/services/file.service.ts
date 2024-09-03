// import { BadRequestException, Injectable, Logger } from '@nestjs/common';
// import { DataService } from '../data.service';
// import { Multer } from 'multer';
// import { RedisService } from './redis.service';
// import { SemaphoreService } from './semaphore.service';
// import { FileUploadGateway } from '../FileUploadGateway';

// @Injectable()
// export class FileService {
//   private readonly logger = new Logger(FileService.name);
//   private processingCount = 0;
//   private readonly MAX_CONCURRENT_UPLOADS = 5;
//   private readonly fileUploadGateway: FileUploadGateway
//   constructor(private readonly dataService: DataService,  private readonly redisService: RedisService, private readonly semaphoreService: SemaphoreService) {}

  
//   async getFileContents(fileId: number) {
//     this.logger.log(`Fetching contents for file ${fileId}`);
//     try {
//       const contents = await this.dataService.getFileContents(fileId);
//       return contents;
//     } catch (error) {
//       this.logger.error(`Error fetching file contents for file ${fileId}:`, error.stack);
//       throw error;
//     }
//   }
  
//   async getFile(fileId: number) {
//     this.logger.log(`Fetching file info for file ${fileId}`);
//     return this.dataService.getFile(fileId);
//   }

// //   async uploadFile(file: Express.Multer.File, userId: number) {
// //     try {
// //         this.logger.log(`Uploading file: ${file.filename} by user ${userId}`);
// //         await this.dataService.addFile(file.filename, file.path, userId);
// //         return { status: 'uploaded', file: file.filename };
// //     } catch (error) {
// //         this.logger.error(`Error uploading file: ${file.filename}`, error.stack);
// //         return { status: 'error', file: file.filename, error: error.message };
// //     } finally {
// //         // Wait for the processing count to be decremented before moving on
// //         await this.redisService.decrementProcessingCount();
// //         await this.processNextInQueue();
// //     }
// // }



// //   async queueFile(file: Express.Multer.File, userId: number) {
// //     const queueItem = JSON.stringify({ file: { filename: file.filename, path: file.path }, userId });
// //     await this.redisService.addToQueue(queueItem);
// //     this.logger.log(`File queued: ${file.filename} by user ${userId}`);
// //     return { status: 'queued', file: file.filename };
// //   }

// // async uploadFile(file: Express.Multer.File, userId: number) {
// //   try {
// //     this.logger.log(`Uploading file: ${file.originalname} by user ${userId}`);
// //     await this.dataService.addFile(file.originalname, file.buffer, userId);
// //     return { status: 'uploaded', file: file.originalname };
// //   } catch (error) {
// //     this.logger.error(`Error uploading file: ${file.originalname}`, error.stack);
// //     return { status: 'error', file: file.originalname, error: error.message };
// //   } finally {
// //     await this.redisService.decrementProcessingCount();
// //     await this.processNextInQueue();
// //   }
// // }

// async uploadFile(file: Express.Multer.File, userId: number) {
//   try {
//     console.log(`Uploading file: ${file.originalname} by user ${userId}`);
//     console.log(`Uploading file: ${file.originalname} by user ${userId}, file buffer: ${file.buffer}`);
    
//     if (!file.originalname || !file.buffer || !userId) {
//       throw new BadRequestException('Invalid file or user data');
//     }

//     await this.dataService.addFile(file.originalname, file.buffer, userId);
//     return { status: 'uploaded', file: file.originalname };
//   } catch (error) {
//     console.error(`Error uploading file: ${file.originalname}`, error.stack);
//     throw error;
//   } finally {
//     // Decrement the processing count and process the next file in the queue
//     await this.redisService.decrementProcessingCount();
//     await this.processNextInQueue();
//   }
// }

// async queueFile(file: Express.Multer.File, userId: number) {
//   const queueItem = JSON.stringify({ file: { originalname: file.originalname, buffer: file.buffer }, userId });
//   await this.redisService.addToQueue(queueItem);
//   this.logger.log(`File queued: ${file.originalname} by user ${userId}`);
//   return { status: 'queued', file: file.originalname };
// }

//   // private async processNextInQueue() {
//   //   const processingCount = await this.redisService.getProcessingCount();
//   //   if (processingCount < this.MAX_CONCURRENT_UPLOADS) {
//   //     const nextItem = await this.redisService.getNextInQueue();
//   //     if (nextItem) {
//   //       try {
//   //         const { file, userId } = JSON.parse(nextItem);
//   //         await this.redisService.incrementProcessingCount();
//   //         this.uploadFile(file, userId);
//   //       } catch (error) {
//   //         this.logger.error('Error processing queued item:', error);
//   //         await this.redisService.decrementProcessingCount();
//   //       }
//   //     }
//   //   }
//   // }

//   private async processNextInQueue() {
//     const processingCount = await this.redisService.getProcessingCount();
//     if (processingCount < this.MAX_CONCURRENT_UPLOADS) {
//         const nextItem = await this.redisService.getNextInQueue();
//         if (nextItem) {
//             try {
//                 const { file, userId } = JSON.parse(nextItem);
//                 await this.redisService.incrementProcessingCount();
//                 await this.uploadFile(file, userId); // Await ensures the next process isn't started before the current one finishes
//             } catch (error) {
//                 this.logger.error('Error processing queued item:', error);
//                 await this.redisService.decrementProcessingCount();
//             }
//         }
//     }
// }

//   async getQueueLength() {
//     return this.redisService.getQueueLength();
//   }

//   async getProcessingCount() {
//     return this.redisService.getProcessingCount();
//   }

//   async decrementProcessingCount() {
//     return this.redisService.decrementProcessingCount();
//   }

//   async incrementProcessingCount() {
//     return this.redisService.incrementProcessingCount();
//   }
  
  

//   async getFilesByUser(userId: number) {
//     this.logger.log(`File requested by user ${userId}`);
//     console.log('File requested by user ${userId}');
//     return this.dataService.getUserFiles(userId);
//   }

//   async addCustomerToFile(fileId: number, customerData: any) {
//     return this.dataService.addCustomer(customerData, fileId);
//   }

//   async deleteFile(fileId: number) {
//     this.logger.log(`File deletion requested for file ${fileId}`);
//     console.log(`File deletion requested for file ${fileId}`);
//     return this.dataService.deleteFile(fileId);
//   }             
// }

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
  private readonly MAX_CONCURRENT_UPLOADS = 5;
  @Inject(FileUploadGateway) private readonly fileUploadGateway: FileUploadGateway
  constructor(private readonly dataService: DataService,  private readonly redisService: RedisService, private readonly semaphoreService: SemaphoreService) {}

  
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
//     this.logger.log(`Uploading file: ${file.originalname} by user ${userId}`);
//     await this.dataService.addFile(file.originalname, file.buffer, userId);
//     return { status: 'uploaded', file: file.originalname };
//   } catch (error) {
//     this.logger.error(`Error uploading file: ${file.originalname}`, error.stack);
//     return { status: 'error', file: file.originalname, error: error.message };
//   } finally {
//     await this.redisService.decrementProcessingCount();
//     await this.processNextInQueue();
//   }
// }

// async uploadFile(file: Express.Multer.File, userId: number) {
//   try {
//     console.log(`Uploading file: ${file.originalname} by user ${userId}`);
    
//     if (!file.originalname || !file.buffer || !userId) {
//       throw new BadRequestException('Invalid file or user data');
//     }

//     // Simulate upload progress
//     for (let i = 0; i <= 100; i += 10) {
//       await new Promise(resolve => setTimeout(resolve, 100)); // Delay for demonstration
//       console.log(`Progress: ${i}%`, file.originalname, userId);
//       this.fileUploadGateway.updateUploadProgress(userId.toString(), file.originalname, i);
//     }

//     await this.dataService.addFile(file.originalname, file.buffer, userId);
//     this.fileUploadGateway.completeUpload(userId.toString(), file.originalname);
//     return { status: 'uploaded', file: file.originalname };
//   } catch (error) {
//     console.error(`Error uploading file: ${file.originalname}`, error.stack);
//     throw error;
//   } finally {
//     await this.redisService.decrementProcessingCount();
//     await this.processNextInQueue();
//   }
// }

// async queueFile(file: Express.Multer.File, userId: number) {
//   const queueItem = JSON.stringify({ file: { originalname: file.originalname, buffer: file.buffer }, userId });
//   await this.redisService.addToQueue(queueItem);
//   this.logger.log(`File queued: ${file.originalname} by user ${userId}`);
//   return { status: 'queued', file: file.originalname };
// }


//   private async processNextInQueue() {
//     const processingCount = await this.redisService.getProcessingCount();
//     if (processingCount < this.MAX_CONCURRENT_UPLOADS) {
//         const nextItem = await this.redisService.getNextInQueue();
//         if (nextItem) {
//             try {
//                 const { file, userId } = JSON.parse(nextItem);
//                 await this.redisService.incrementProcessingCount();
//                 await this.uploadFile(file, userId); // Await ensures the next process isn't started before the current one finishes
//             } catch (error) {
//                 this.logger.error('Error processing queued item:', error);
//                 await this.redisService.decrementProcessingCount();
//             }
//         }
//     }
// }


// async uploadFile(file: Express.Multer.File, userId: number) {
//   try {
//     console.log(`Uploading file: ${file.originalname} by user ${userId}`);
    
//     if (!file.originalname || !file.buffer || !userId) {
//       throw new BadRequestException('Invalid file or user data');
//     }

//     // Simulate upload progress
//     for (let i = 0; i <= 100; i += 10) {
//       await new Promise(resolve => setTimeout(resolve, 100)); // Delay for demonstration
//       console.log(`Progress: ${i}%`, file.originalname, userId);
//       this.fileUploadGateway.updateUploadProgress(userId.toString(), file.originalname, i);
//     }

//     await this.dataService.addFile(file.originalname, file.buffer, userId);
//     this.fileUploadGateway.completeUpload(userId.toString(), file.originalname);
//     return { status: 'uploaded', file: file.originalname };
//   } catch (error) {
//     console.error(`Error uploading file: ${file.originalname}`, error.stack);
//     throw error;
//   } finally {
//     await this.redisService.decrementProcessingCount();
//     await this.processNextInQueue();
//   }
// }

// async queueFile(file: Express.Multer.File, userId: number) {
//   const queueItem = JSON.stringify({ file: { originalname: file.originalname, buffer: file.buffer }, userId });
//   await this.redisService.addToQueue(queueItem);
//   this.logger.log(`File queued: ${file.originalname} by user ${userId}`);
//   return { status: 'queued', file: file.originalname };
// }


//   private async processNextInQueue() {
//     const processingCount = await this.redisService.getProcessingCount();
//     if (processingCount < this.MAX_CONCURRENT_UPLOADS) {
//         const nextItem = await this.redisService.getNextInQueue();
//         if (nextItem) {
//             try {
//                 const { file, userId } = JSON.parse(nextItem);
//                 await this.redisService.incrementProcessingCount();
//                 await this.uploadFile(file, userId); // Await ensures the next process isn't started before the current one finishes
//             } catch (error) {
//                 this.logger.error('Error processing queued item:', error);
//                 await this.redisService.decrementProcessingCount();
//             }
//         }
//     }
// }

async uploadFile(file: Express.Multer.File, userId: number) {
  try {
    console.log(`Uploading file: ${file.originalname} by user ${userId}`);
    
    if (!file.originalname || !file.buffer || !userId) {
      throw new BadRequestException('Invalid file or user data');
    }

    this.fileUploadGateway.notifyFileProcessing(userId.toString(), file.originalname);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Delay for demonstration
      console.log(`Progress: ${i}%`, file.originalname, userId);
      this.fileUploadGateway.updateUploadProgress(userId.toString(), file.originalname, i);
    }

    await this.dataService.addFile(file.originalname, file.buffer, userId);
    this.fileUploadGateway.completeUpload(userId.toString(), file.originalname);
    return { status: 'uploaded', file: file.originalname };
  } catch (error) {
    console.error(`Error uploading file: ${file.originalname}`, error.stack);
    throw error;
  } finally {
    await this.redisService.decrementProcessingCount();
    await this.processNextInQueue();
  }
}

async queueFile(file: Express.Multer.File, userId: number) {
  const queueItem = JSON.stringify({ file: { originalname: file.originalname, buffer: file.buffer }, userId });
  await this.redisService.addToQueue(queueItem);
  this.fileUploadGateway.notifyFileQueued(userId.toString(), file.originalname);
  this.logger.log(`File queued: ${file.originalname} by user ${userId}`);
  return { status: 'queued', file: file.originalname };
}

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
