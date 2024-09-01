import { Controller, Post, UploadedFile,UploadedFiles, UseInterceptors, Param, Get, Body } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import { Multer } from 'multer';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // @Post('upload/:userId')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Param('userId') userId: number,
  // ) {
  //   return this.fileService.uploadFile(file, userId);
  // }

  //  @Post('upload/:userId')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Param('userId') userId: number,
  // ) {
  //   const queueLength = await this.fileService.getQueueLength();
  //   if (queueLength < 5) {
  //     return this.fileService.uploadFile(file, userId);
  //   } else {
  //     return this.fileService.queueFile(file, userId);
  //   }
  // }

  @Post('upload/:userId')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('userId') userId: number,
  ) {
    for (const file of files) {
      const queueLength = await this.fileService.getQueueLength();
      if (queueLength < 5) {
        await this.fileService.uploadFile(file, userId);
      } else {
        await this.fileService.queueFile(file, userId);
      }
    }
    return { message: 'Files processed successfully' };
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
}