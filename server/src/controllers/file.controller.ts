import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors, Param, Get, Body, Delete, Res, StreamableFile, Inject } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import { Multer } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { FileUploadGateway } from '../FileUploadGateway';
import { RedisService } from '../services/redis.service';
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) { }
  private readonly MAX_CONCURRENT_UPLOADS = 3;
  @Inject(FileUploadGateway) private readonly fileUploadGateway: FileUploadGateway
  @Inject(RedisService) private readonly redisService: RedisService

@Post('upload/:userId')
@UseInterceptors(FilesInterceptor('files'))
async uploadFiles(
  @UploadedFiles() files: Express.Multer.File[],
  @Param('userId') userId: number,
) {
  const initialQueueLength = await this.fileService.getQueueLength();
  const initialProcessingCount = await this.fileService.getProcessingCount();
  console.log(`Initial queue length: ${initialQueueLength}, Processing count: ${initialProcessingCount}`);

 
  // Split files into two arrays
  const filesToProcess = files.slice(0, this.MAX_CONCURRENT_UPLOADS);
  const filesToQueue = files.slice(this.MAX_CONCURRENT_UPLOADS);

  const results = [];

  // Process the first set of files
  for (const file of filesToProcess) {
    const currentProcessingCount = await this.fileService.getProcessingCount();

    if (currentProcessingCount < this.MAX_CONCURRENT_UPLOADS) {
      
      results.push(this.fileService.uploadFile(file, userId));
    } else {
      results.push(this.fileService.queueFile(file, userId));
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Queue the remaining files
  for (const file of filesToQueue) {
    results.push(this.fileService.queueFile(file, userId));
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await Promise.all(results);
  
  return {
    message: 'Files processed or queued successfully',
    results: results
  };
}


// @Post('upload/:userId')
// @UseInterceptors(FilesInterceptor('files'))
// async uploadFiles(
//   @UploadedFiles() files: Express.Multer.File[],
//   @Param('userId') userId: number,
// ) {
//   const initialQueueLength = await this.fileService.getQueueLength();
//   const initialProcessingCount = await this.fileService.getProcessingCount();
//   console.log(`Initial queue length: ${initialQueueLength}, Processing count: ${initialProcessingCount}`);

//   const results = [];

//   // Function to process files in batches
//   const processFiles = async (batchFiles: Express.Multer.File[], userId: number) => {
//     const batchResults = await Promise.all(batchFiles.map(async (file) => {
//       const currentProcessingCount = await this.fileService.getProcessingCount();
//       console.log(`Current processing count: ${currentProcessingCount}`);

//       // Process or queue based on the current processing count
//       if (currentProcessingCount < this.MAX_CONCURRENT_UPLOADS) {
//         return this.fileService.uploadFile(file, userId);
//       } else {
//         return this.fileService.queueFile(file, userId);
//       }
//     }));
//     return batchResults;
//   };

//   // Process the first batch of files (up to MAX_CONCURRENT_UPLOADS)
//   const filesToProcess = files.slice(0, this.MAX_CONCURRENT_UPLOADS);
//   const filesToQueue = files.slice(this.MAX_CONCURRENT_UPLOADS);

//   // Start processing the first batch
//   const processingResults = await Promise.allSettled(await processFiles(filesToProcess, userId));

//   // Queue the remaining files
//   const queueResults = await Promise.allSettled(filesToQueue.map(file => this.fileService.queueFile(file, userId)));

//   // Combine processing and queuing results
//   results.push(...processingResults, ...queueResults);

  

//   return {
//     message: 'Files processed or queued successfully',
//     results: results
//   };
// }


// @Post('upload/:userId')
// @UseInterceptors(FilesInterceptor('files'))
// async uploadFiles(
//   @UploadedFiles() files: Express.Multer.File[],
//   @Param('userId') userId: number,
// ) {
//   const initialQueueLength = await this.fileService.getQueueLength();
//   const initialProcessingCount = await this.fileService.getProcessingCount();
//   console.log(`Initial queue length: ${initialQueueLength}, Processing count: ${initialProcessingCount}`);

//   const results = [];

//   // Function to introduce a delay
//   const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//   // Function to process files in batches with delay
//   const processFiles = async (batchFiles: Express.Multer.File[], userId: number) => {
//     const batchResults = [];
//     for (const file of batchFiles) {
//       const currentProcessingCount = await this.fileService.getProcessingCount();
//       console.log(`Current processing count: ${currentProcessingCount}`);

//       // Process or queue based on the current processing count
//       if (currentProcessingCount < this.MAX_CONCURRENT_UPLOADS) {
//         batchResults.push(await this.fileService.uploadFile(file, userId));
//       } else {
//         batchResults.push(await this.fileService.queueFile(file, userId));
//       }

//       // Introduce a delay between processing each file
//       await sleep(1000); // Delay of 500 milliseconds
//     }
//     return batchResults;
//   };

//   // Process the first batch of files (up to MAX_CONCURRENT_UPLOADS)
//   const filesToProcess = files.slice(0, this.MAX_CONCURRENT_UPLOADS);
//   const filesToQueue = files.slice(this.MAX_CONCURRENT_UPLOADS);

//   // Start processing the first batch
//   const processingResults = await Promise.allSettled(await processFiles(filesToProcess, userId));

//   // Queue the remaining files
//   const queueResults = await Promise.allSettled(filesToQueue.map(file => this.fileService.queueFile(file, userId)));

//   // Combine processing and queuing results
//   results.push(...processingResults, ...queueResults);


//   return {
//     message: 'Files processed or queued successfully',
//     results: results
//   };
// }

  @Get(':id/contents')
  async getFileContents(@Param('id') id: string) {
    return this.fileService.getFileContents(parseInt(id));
  }



  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const file = await this.fileService.getFile(parseInt(id));
    
    res.set({
      'Content-Disposition': `attachment; filename="${file.f_name}"`,
      'Content-Type': 'application/octet-stream',
    });

    return new StreamableFile(file.f_content);
  }


  @Get('user/:userId')
  async getFilesByUser(@Param('userId') userId: number) {
    return this.fileService.getFilesByUser(userId);
  }

  @Post(':fileId/add-customer')
  async addCustomerToFile(
    @Param('fileId') fileId: number,
    @Body() customerData: any
  ) {
    return this.fileService.addCustomerToFile(fileId, customerData);
  }


  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: number) {
    return this.fileService.deleteFile(fileId);
  }



//   @Get('updates/:userId/:fileName')
// async getFileUpdates(@Param('userId') userId: string, @Param('fileName') fileName: string, @Res() res: Response) {
//   const pollInterval = 1000; // Poll every second

//   const poll = async () => {
//     try {
//       const processingQueue = await this.redisService.getProcessingQueue();
//       const uploadQueue = await this.redisService.getFullQueue();
//       const queueItem = JSON.stringify({ file: { originalname: fileName }, userId });

//       if (processingQueue.includes(queueItem)) {
//         res.json({ status: 'in-progress' });
//       } else if (uploadQueue.includes(queueItem)) {
//         res.json({ status: 'queued' });
//       } else {
//         res.json({ status: 'completed' });
//       }
//     } catch (err) {
//       res.status(500).json({ error: 'Error fetching file updates' });
//     }
//   };

// @Get('updates/:userId/:fileName')
// async getFileUpdates(@Param('userId') userId: string, @Param('fileName') fileName: string, @Res() res: Response) {
//   const pollInterval = 1000; // Poll every second

//   const poll = async () => {
//     try {
//       console.log(`Polling for updates for userId: ${userId}, fileName: ${fileName}`);

//       const processingQueue = await this.redisService.getProcessingQueue();
//       console.log(`Processing queue:`, processingQueue);

//       const uploadQueue = await this.redisService.getFullQueue();
    

//       const isItemInQueue = (queue: string[], fileName: string, userId: string): boolean => {
//         for (const item of queue) {
//           const parsedItem = JSON.parse(item);
          
//           if (parsedItem.file.originalname === fileName && parsedItem.userId === userId) {
//             console.log(`Match found in queue for fileName: ${fileName}, userId: ${userId}`);
//             return true;
//           }
//         }
//         return false;
//       };

//       if (isItemInQueue(processingQueue, fileName, userId)) {
//         console.log(`File ${fileName} for user ${userId} is in progress`);
//         res.json({ status: 'in-progress' });
//         clearInterval(intervalId); // Clear the interval after sending a response
//       } else if (isItemInQueue(uploadQueue, fileName, userId)) {
//         console.log(`File ${fileName} for user ${userId} is queued`);
//         res.json({ status: 'queued' });
//         clearInterval(intervalId); // Clear the interval after sending a response
//       } else {
//         console.log(`File ${fileName} for user ${userId} is completed`);
//         res.json({ status: 'completed' });
//         clearInterval(intervalId); // Clear the interval after sending a response
//       }
//     } catch (err) {
//       console.error('Error fetching file updates:', err);
//       res.status(500).json({ error: 'Error fetching file updates' });
//       clearInterval(intervalId); // Clear the interval after sending a response
//     }
//   };

//   const intervalId = setInterval(poll, pollInterval);
// }


// @Get('updates/:userId/:fileName')
// async getFileUpdates(@Param('userId') userId: string, @Param('fileName') fileName: string, @Res() res: Response) {
//   const pollInterval = 1000; // Poll every second

//   const poll = async () => {
//     try {
//       const processingQueue = await this.redisService.getProcessingQueue();
//       const uploadQueue = await this.redisService.getFullQueue();
//       console.log(`uploadQueue queue:`, uploadQueue);
//       const isItemInQueue = (queue: string[], fileName: string, userId: string): boolean => {
//         for (const item of queue) {
//           const parsedItem = JSON.parse(item);
//           if (parsedItem.file.originalname === fileName && parsedItem.userId === userId) {
//             return true;
//           }
//         }
//         return false;
//       };

//       if (isItemInQueue(processingQueue, fileName, userId)) {
//         res.json({ status: 'in-progress' });
//         clearInterval(intervalId); // Stop polling
//       } else if (isItemInQueue(uploadQueue, fileName, userId)) {
//         res.json({ status: 'queued' });
//         clearInterval(intervalId); // Stop polling
//       } else {
//         res.json({ status: 'completed' });
//         clearInterval(intervalId); // Stop polling
//       }
//     } catch (err) {
//       console.error('Error fetching file updates:', err);
//       res.status(500).json({ error: 'Error fetching file updates' });
//       clearInterval(intervalId);
//     }
//   };

//   const intervalId = setInterval(poll, pollInterval);
// }


@Get('updates/:userId/:fileName')
async getFileUpdates(@Param('userId') userId: string, @Param('fileName') fileName: string, @Res() res: Response) {
  const pollInterval = 1000; // Poll every second
  let intervalId: NodeJS.Timeout;

  const poll = async () => {
    try {
      const processingQueue = await this.redisService.getProcessingQueue();
      const uploadQueue = await this.redisService.getFullQueue();
      console.log(`uploadQueue queue:`, uploadQueue);

      const isItemInQueue = (queue: string[], fileName: string, userId: string): boolean => {
        for (const item of queue) {
          const parsedItem = JSON.parse(item);
          console.log('Parsed Item:', parsedItem);
          if (parsedItem.file.originalname === fileName && parsedItem.userId === userId) {
            console.log(`Match found in queue for fileName: ${fileName}, userId: ${userId}`);
            return true;
          }
        }
        return false;
      };

      if (isItemInQueue(processingQueue, fileName, userId)) {
        console.log(`File ${fileName} for user ${userId} is in progress`);
        res.json({ status: 'in-progress' });
        clearInterval(intervalId); // Stop polling
      } else if (isItemInQueue(uploadQueue, fileName, userId)) {
        console.log(`File ${fileName} for user ${userId} is queued`);
        res.json({ status: 'queued' });
        clearInterval(intervalId); // Stop polling
      } else {
        console.log(`File ${fileName} for user ${userId} is completed`);
        res.json({ status: 'completed' });
        clearInterval(intervalId); // Stop polling
      }
    } catch (err) {
      console.error('Error fetching file updates:', err);
      res.status(500).json({ error: 'Error fetching file updates' });
      clearInterval(intervalId); // Stop polling on error
    }
  };

  // Add a delay before starting the polling
  setTimeout(() => {
    intervalId = setInterval(poll, pollInterval);
  }, 100); // 2 seconds delay
}



}

