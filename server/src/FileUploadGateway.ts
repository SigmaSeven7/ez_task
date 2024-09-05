import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FileUploadGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  notifyUploadStart(userId: string, fileName: string) {
    this.server.emit(`uploadStart:${userId}`, { fileName });
  }

  updateUploadProgress(userId: string, fileName: string, progress: number) {
    this.server.emit(`uploadProgress:${userId}`, { fileName, progress });
  }

  completeUpload(userId: string, fileName: string) {
    this.server.emit(`uploadComplete:${userId}`, { fileName });
  }

  notifyFileQueued(userId: string, fileName: string) {
    this.server.emit(`fileQueued:${userId}`, { fileName });
  }

  notifyFileProcessing(userId: string, fileName: string) {
    this.server.emit(`fileProcessing:${userId}`, { fileName });
  }
}