
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
    try {
      const files = await this.databaseService.query('SELECT * FROM files') as any[];
      console.log('Files from database:', files); // Log the files retrieved from the database
  
      const validFiles = [];
  
      for (const file of files) {
        const filePath = path.join(__dirname, '..', file.f_path); // Adjusted to avoid duplicating 'uploads'
        console.log('Checking file path:', filePath); // Log the file path being checked
  
        if (fs.existsSync(filePath)) {
          console.log('File exists:', filePath); // Log if the file exists
          validFiles.push(file);
        } else {
          console.log('File does not exist, deleting from database:', filePath); // Log if the file does not exist
          await this.databaseService.query('DELETE FROM files WHERE f_id = ?', [file.f_id]);
        }
      }
      if(validFiles.length === 0) {
        await this.databaseService.query('ALTER TABLE files AUTO_INCREMENT = 1');
      }
      console.log('Valid files:', validFiles); // Log the valid files array
      return validFiles;
    } catch (error) {
      console.error('Error in getFiles:', error); // Log any errors
      throw error;
    }
  }


  async deleteFile(fileId: number): Promise<void> {
    // Get the file path from the database
    const file = await this.databaseService.query('SELECT f_path FROM files WHERE f_id = ?', [fileId]) as any[];
    if (file.length === 0) {
      throw new Error(`File with ID ${fileId} not found`);
    }

    const filePath = path.join(__dirname, '..', file[0].f_path);

    // Delete the file record from the database
    await this.databaseService.query('DELETE FROM files WHERE f_id = ?', [fileId]);

    // Delete the file from the file system
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getCustomers() {
    return this.databaseService.query('SELECT * FROM customers');
  }

  // async getUserFiles(userId: number) {
  //   const sql = 'SELECT * FROM files WHERE user_id = ?';
  //   return this.databaseService.query(sql, [userId]);
  // }

  async getUserFiles(userId: number) {
    try {
      const files = await this.databaseService.query('SELECT * FROM files WHERE user_id = ?', [userId]) as any[];
      console.log(`Files from database for user ${userId}:`, files);

      const validFiles = [];

      for (const file of files) {
        const filePath = path.join(__dirname, '..', file.f_path);
        console.log('Checking file path:', filePath);

        if (fs.existsSync(filePath)) {
          console.log('File exists:', filePath);
          validFiles.push(file);
        } else {
          console.log('File does not exist, deleting from database:', filePath);
          await this.databaseService.query('DELETE FROM files WHERE f_id = ?', [file.f_id]);
        }
      }

      if (validFiles.length === 0) {
        await this.databaseService.query('ALTER TABLE files AUTO_INCREMENT = 1');
      }

      console.log('Valid files for user:', validFiles);
      return validFiles;
    } catch (error) {
      console.error(`Error in getUserFiles for user ${userId}:`, error);
      throw error;
    }
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