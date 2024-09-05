
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


  async getFiles() {
    try {
      // Retrieve all files from the database
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
  
      // Now check if there are any files left in the table
      const remainingFiles = await this.databaseService.query('SELECT COUNT(*) as count FROM files');
      const remainingCount = remainingFiles[0].count;
      console.log('Remaining files in the database:', remainingFiles);
      if (remainingCount === 0) {
        // Reset the auto-increment to 1 if no files are left
        console.log('No files left in the database, resetting AUTO_INCREMENT.');
        await this.databaseService.query('ALTER TABLE files AUTO_INCREMENT = 1');
      }
  
      console.log('Valid files:', validFiles); // Log the valid files array
      return validFiles;
    } catch (error) {
      console.error('Error in getFiles:', error); // Log any errors
      throw error;
    }
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
      
      console.log('File from database:', {
        name: file[0].f_name,
        contentLength: file[0].f_content.length
      });
      
      // Decode the base64 content
      const fileBuffer = Buffer.from(file[0].f_content, 'base64');
  
      // Try to read the buffer as an Excel file
      try {
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        console.log('Workbook sheets:', workbook.SheetNames);
  
        if (workbook.SheetNames.length === 0) {
          throw new Error('No sheets found in the workbook');
        }
  
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Get the range of the sheet
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        console.log('Sheet range:', range);

        // Get cell values
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
        console.log('Cell values:', cellValues);

        // Convert the worksheet to JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
        
        console.log('Parsed data:', data);
  
        // Return both the parsed data and the cell values
        return data?.at(0) ;
      } catch (xlsxError) {
        console.error('Error parsing Excel file:', xlsxError);
        
        // If Excel parsing fails, return an error message
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
  

  
      if (files.length === 0) {
        console.log(`No files found for user ${userId}`);
      }
  
      return files;
    } catch (error) {
      console.error(`Error in getUserFiles for user ${userId}:`, error);
      throw error;
    }
  }

  // async addFile(filename: string, filePath: string, userId: number) {
  //   const sql = 'INSERT INTO files (f_name, f_path, user_id) VALUES (?, ?, ?)';
  //   return this.databaseService.query(sql, [filename, filePath, userId]);
  // }

  async addCustomer(customerData: any, fileId: number) {
    const { c_name, c_email, c_israeli_id, c_phone } = customerData;
    const sql = 'INSERT INTO customers (c_name, c_email, c_israeli_id, c_phone, f_id) VALUES (?, ?, ?, ?, ?)';
    return this.databaseService.query(sql, [c_name, c_email, c_israeli_id, c_phone, fileId]);
  }
}