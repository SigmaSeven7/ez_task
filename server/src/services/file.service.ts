import { Injectable } from '@nestjs/common';
import { DataService } from '../data.service';
import { Multer } from 'multer';

@Injectable()
export class FileService {
  constructor(private readonly dataService: DataService) {}

  async uploadFile(file: Express.Multer.File, userId: number) {
    return this.dataService.addFile(file.filename, file.path, userId);
  }

  async getFilesByUser(userId: number) {
    return this.dataService.getUserFiles(userId);
  }

  async addCustomerToFile(fileId: number, customerData: any) {
    return this.dataService.addCustomer(customerData, fileId);
  }
}