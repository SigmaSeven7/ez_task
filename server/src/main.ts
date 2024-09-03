// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { loggerConfig } from './logger.config';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, {
//     logger: loggerConfig,
//   });
  
//   const allowedOrigins = ['http://localhost:5173','http://client:5173','https://react:5173', 'http://localhost', 'http://localhost:80', 'http://react:80'];
  
//   app.enableCors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         console.log('Origin not allowed by CORS:', origin);
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//   });

//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerConfig } from './logger.config';
import * as bodyParser from 'body-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig,
  });
  app.enableCors({
    origin: true, // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3000, '0.0.0.0'); // Listen on all network interfaces
}
bootstrap();