import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { DatabaseService } from '../services/database-service.service';
import { DataService } from '../services/data.service';
import { FileService } from '../services/file.service';
import { FileController } from '../controllers/file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; 
import { RedisService } from '../services/redis.service';
import { RedisModule } from './redis.module';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(), 
    }),
    RedisModule, 
  ],
  controllers: [AppController, FileController],
  providers: [AppService, DataService, DatabaseService, FileService, RedisService],
})
export class AppModule {}