import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database-service.service';
import { DataService } from './data.service';
import { FileService } from './services/file.service';
import { FileController } from './controllers/file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; // Import memoryStorage
import { RedisService } from './services/redis.service';
import { SemaphoreService } from './services/semaphore.service';
import { RedisModule } from './redis.module';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(), // Use memoryStorage to keep file buffer in memory
    }),
    RedisModule, // Ensure RedisModule is imported here
  ],
  controllers: [AppController, FileController],
  providers: [AppService, DataService, DatabaseService, FileService, RedisService, SemaphoreService],
})
export class AppModule {}