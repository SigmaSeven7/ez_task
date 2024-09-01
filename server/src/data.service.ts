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
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DataService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUsers() {
    return this.databaseService.query('SELECT * FROM users');
  }

  async getFiles() {
    const files = await this.databaseService.query('SELECT * FROM files') as any[];
    const validFiles = [];

    for (const file of files) {
      const filePath = path.join(__dirname, '..', 'uploads', file.f_path);
      if (fs.existsSync(filePath)) {
        validFiles.push(file);
      } else {
        await this.databaseService.query('DELETE FROM files WHERE f_id = ?', [file.f_id]);
      }
    }

    return validFiles;
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