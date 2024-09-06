import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      host: 'mariadb',
      user: 'ezuser',
      password: 'ezpass',
      database: 'excel_upload_tasks',
    });
  }

  async query(sql: string, params?: any[]) {
    const [results] = await this.pool.execute(sql, params);
    return results;
  }
}