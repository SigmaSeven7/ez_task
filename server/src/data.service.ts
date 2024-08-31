// import { Injectable } from '@nestjs/common';
// import { DatabaseService } from './database-service.service';

// @Injectable()
// export class DataService {
//   constructor(private readonly databaseService: DatabaseService) {}

//   async getUsers() {
//     return this.databaseService.query('SELECT * FROM users');
//   }

//   async getFiles() {
//     return this.databaseService.query('SELECT * FROM files');
//   }

//   async getCustomers() {
//     return this.databaseService.query('SELECT * FROM customers');
//   }

//   async getUserFiles(userId: number) {
//     const sql = 'SELECT * FROM files WHERE u_id = ?';
//     return this.databaseService.query(sql, [userId]);
//   }

//   async addFile(filename: string, filePath: string, userId: number) {
//     const sql = 'INSERT INTO files (filename, file_path, u_id) VALUES (?, ?, ?)';
//     return this.databaseService.query(sql, [filename, filePath, userId]);
//   }

//   async addCustomer(customerData: any, fileId: number) {
//     const { c_name, c_email, c_israeli_id, c_phone } = customerData;
//     const sql = 'INSERT INTO customers (c_name, c_email, c_israeli_id, c_phone, f_id) VALUES (?, ?, ?, ?, ?)';
//     return this.databaseService.query(sql, [c_name, c_email, c_israeli_id, c_phone, fileId]);
//   }
// }

import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database-service.service';

@Injectable()
export class DataService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUsers() {
    return this.databaseService.query('SELECT * FROM users');
  }

  async getFiles() {
    return this.databaseService.query('SELECT * FROM files');
  }

  async getCustomers() {
    return this.databaseService.query('SELECT * FROM customers');
  }

  async getUserFiles(userId: number) {
    const sql = 'SELECT * FROM files WHERE user_id = ?';
    return this.databaseService.query(sql, [userId]);
  }

  async addFile(filename: string, filePath: string, userId: number) {
    const sql = 'INSERT INTO files (f_name, f_path, user_id) VALUES (?, ?, ?)';
    return this.databaseService.query(sql, [filename, filePath, userId]);
  }

  async addCustomer(customerData: any, fileId: number) {
    const { c_name, c_email, c_israeli_id, c_phone } = customerData;
    const sql = 'INSERT INTO customers (c_name, c_email, c_israeli_id, c_phone, f_id) VALUES (?, ?, ?, ?, ?)';
    return this.databaseService.query(sql, [c_name, c_email, c_israeli_id, c_phone, fileId]);
  }
}