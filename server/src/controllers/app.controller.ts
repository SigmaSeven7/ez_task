import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { DataService } from '../services/data.service';

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


  @Get('customers')
  async getCustomers() {
    return this.dataService.getCustomers();
  }
}
