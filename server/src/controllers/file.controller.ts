import { Controller, Post, UploadedFile, UseInterceptors, Param, Get, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import { Multer } from 'multer';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: number,
  ) {
    return this.fileService.uploadFile(file, userId);
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