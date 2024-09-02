import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors, Param, Get, Body, Delete, Res, StreamableFile } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import { Multer } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) { }
  private readonly MAX_CONCURRENT_UPLOADS = 5;
 
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

    // Process the first 5 files
    for (const file of filesToProcess) {
      const currentProcessingCount = await this.fileService.getProcessingCount();
      const currentQueueLength = await this.fileService.getQueueLength();

      console.log(`Processing file: ${file.filename}, Current processing count: ${currentProcessingCount}, Current queue length: ${currentQueueLength}`);

      if (currentProcessingCount < this.MAX_CONCURRENT_UPLOADS) {
        await this.fileService.incrementProcessingCount();
        results.push(await this.fileService.uploadFile(file, userId));
      } else {
        results.push(await this.fileService.queueFile(file, userId));
      }
    }

    // Queue the remaining files
    for (const file of filesToQueue) {
      console.log(`Queueing file: ${file.filename}`);
      results.push(await this.fileService.queueFile(file, userId));
    }

    await Promise.all(results);

    const finalQueueLength = await this.fileService.getQueueLength();
    const finalProcessingCount = await this.fileService.getProcessingCount();
    console.log(`Final queue length: ${finalQueueLength}, Processing count: ${finalProcessingCount}`);

    return {
      message: 'Files processed or queued successfully',
      results: results
    };
  }


  @Get(':id/contents')
  async getFileContents(@Param('id') id: string) {
    return this.fileService.getFileContents(parseInt(id));
  }


  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const file = await this.fileService.getFile(parseInt(id));
    const filePath = path.join(__dirname, '..', '..', file.f_path);
    
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    const fileStream = fs.createReadStream(filePath);

    res.set({
      'Content-Disposition': `attachment; filename="${file.f_name}"`,
      'Content-Type': 'application/octet-stream',
    });

    return new StreamableFile(fileStream);
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
}