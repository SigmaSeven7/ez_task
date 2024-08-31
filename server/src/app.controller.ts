import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DataService } from './data.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataService: DataService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async getUsers() {
    return this.dataService.getUsers();
  }

  @Get('files')
  async getFiles() {
    return this.dataService.getFiles();
  }

  @Get('customers')
  async getCustomers() {
    return this.dataService.getCustomers();
  }
}
