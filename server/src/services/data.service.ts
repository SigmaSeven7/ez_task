
import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database-service.service';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx'

@Injectable()
export class DataService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUsers() {
    return this.databaseService.query('SELECT * FROM users');
  }

  async getFile(fileId: number) {
    const file = await this.databaseService.query('SELECT * FROM files WHERE f_id = ?', [fileId]) as any[];
    if (file.length === 0) {
      throw new Error(`File with ID ${fileId} not found`);
    }
    return file[0];
  }


  async addFile(filename: string, fileContent: Buffer, userId: number) {
    const sql = 'INSERT INTO files (f_name, f_content, user_id) VALUES (?, ?, ?)';
    try {
      const base64Content = fileContent.toString('base64');
      return await this.databaseService.query(sql, [filename, base64Content, userId]);
    } catch (error) {
      console.error('Error adding file to database:', error);
      throw error;
    }
  }

  async getFileContents(fileId: number) {
    try {
      const file = await this.databaseService.query('SELECT f_content, f_name FROM files WHERE f_id = ?', [fileId]) as any[];
      
      if (file.length === 0) {
        throw new Error(`File with ID ${fileId} not found`);
      }
          
      const fileBuffer = Buffer.from(file[0].f_content, 'base64');
  
      try {
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
       
  
        if (workbook.SheetNames.length === 0) {
          throw new Error('No sheets found in the workbook');
        }
  
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        

        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
       

        let cellValues = [];
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({r: R, c: C});
            const cell = worksheet[cellAddress];
            if (cell && cell.v !== undefined) {
              cellValues.push({
                address: cellAddress,
                value: cell.v
              });
            }
          }
        }
       
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
      
  
        return data?.at(0) ;
      } catch (xlsxError) {
        console.error('Error parsing Excel file:', xlsxError);
        
        
        return {
          error: 'Unable to parse as Excel',
          message: xlsxError.message
        };
      }
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }


  async deleteFile(fileId: number): Promise<void> {
    await this.databaseService.query('DELETE FROM files WHERE f_id = ?', [fileId]);
  }


 
  async getCustomers() {
    return this.databaseService.query('SELECT * FROM customers');
  }

  

  async getUserFiles(userId: number) {
    try {
      const files = await this.databaseService.query(
        'SELECT f_id, f_name, uploaded_at FROM files WHERE user_id = ?',
        [userId]
      ) as any[];

      return files;
    } catch (error) {
      console.error(`Error in getUserFiles for user ${userId}:`, error);
      throw error;
    }
  }


  async addCustomer(customerData: any, fileId: number) {
    const { c_name, c_email, c_israeli_id, c_phone } = customerData;
    const sql = 'INSERT INTO customers (c_name, c_email, c_israeli_id, c_phone, f_id) VALUES (?, ?, ?, ?, ?)';
    return this.databaseService.query(sql, [c_name, c_email, c_israeli_id, c_phone, fileId]);
  }
}