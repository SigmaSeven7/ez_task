// // import { Module } from '@nestjs/common';
// // import { AppController } from './app.controller';
// // import { AppService } from './app.service';
// // import { DatabaseService } from './databse-service.service';
// // import { DataService } from './data.service';


// // @Module({
// //   imports: [],
// //   controllers: [AppController],
// //   providers: [AppService,DataService,DatabaseService],
// // })
// // export class AppModule {}


// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { DatabaseService } from './database-service.service';
// import { DataService } from './data.service';
// import { FileService } from './services/file.service';
// import { FileController } from './controllers/file.controller';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';

// @Module({
//   imports: [
//     MulterModule.register({
//       storage: diskStorage({
//         destination: './uploads',
//         filename: (req, file, callback) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//           callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
//         },
//       }),
//     }),
//   ],
//   controllers: [AppController, FileController],
//   providers: [AppService, DataService, DatabaseService, FileService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database-service.service';
import { DataService } from './data.service';
import { FileService } from './services/file.service';
import { FileController } from './controllers/file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [AppController, FileController],
  providers: [AppService, DataService, DatabaseService, FileService],
})
export class AppModule {}