import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Param,
  Get,
  Body,
  Delete,
  Res,
  StreamableFile,
  Inject,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import { Response } from 'express';
import { RedisService } from '../services/redis.service';
import { DataService } from 'src/services/data.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly dataService: DataService,
  ) {}
  private readonly MAX_CONCURRENT_UPLOADS = 3;
  @Inject(RedisService) private readonly redisService: RedisService;

 
  @Post('upload/:userId')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('userId') userId: number,
  ) {

    const filesToProcess = files.slice(0, this.MAX_CONCURRENT_UPLOADS);
    const filesToQueue = files.slice(this.MAX_CONCURRENT_UPLOADS);

    const results = [];

    for (const file of filesToProcess) {
      const uploadId = uuidv4();
      const currentProcessingCount =
        await this.fileService.getProcessingCount();

      if (currentProcessingCount < this.MAX_CONCURRENT_UPLOADS) {
        await this.redisService.addToStatusQueue(
          userId.toString(),
          uploadId,
          file.originalname,
          'waiting',
        );
        const result = await this.fileService.uploadFile(
          file,
          userId,
          uploadId,
        );
        results.push(result);
      } else {
        const result = await this.fileService.queueFile(file, userId, uploadId);
        results.push(result);
      }
    }

   
    for (const file of filesToQueue) {
      const uploadId = uuidv4();
      const result = await this.fileService.queueFile(file, userId, uploadId);
      results.push(result);
    }
    this.fileService.processQueue();
    return {
      message: 'Files processed or queued successfully',
      results: results,
    };
  }

  @Get(':id/contents')
  async getFileContents(@Param('id') id: string) {
    return this.fileService.getFileContents(parseInt(id));
  }

  @Get(':id/download')
  async downloadFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
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
    @Body() customerData: any,
  ) {
    return this.fileService.addCustomerToFile(fileId, customerData);
  }

  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: number) {
    return this.fileService.deleteFile(fileId);
  }

  @Get('updates/:userId/:uploadId')
  async getFileUpdates(
    @Param('userId') userId: string,
    @Param('uploadId') uploadId: string,
    @Res() res: Response,
  ) {
    const pollInterval = 10; // Poll every second
    let intervalId: NodeJS.Timeout;

    const poll = async () => {
      try {
        const fileStatus = await this.redisService.getStatusQueue(
          userId,
          uploadId,
        );

        if (!fileStatus) {
          res.json({ status: 'waiting', progress: 0 });
          clearInterval(intervalId);
        } else if (fileStatus.status === 'in-progress') {
          res.json({
            status: 'in-progress',
            progress: fileStatus.progress || 0,
          });
          clearInterval(intervalId);
        } else if (fileStatus.status === 'queued') {
          res.json({ status: 'queued' });
          clearInterval(intervalId);
        } else if (fileStatus.status === 'completed') {
          res.json({ status: 'completed' });
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error('Error fetching file updates:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error fetching file updates' });
        }
        clearInterval(intervalId);
      }
    };

    setTimeout(() => {
      intervalId = setInterval(poll, pollInterval);
    }, 10);
  }
}
