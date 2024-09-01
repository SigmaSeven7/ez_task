// server/src/semaphore.service.ts
import { Injectable } from '@nestjs/common';
import * as semaphore from 'semaphore';

@Injectable()
export class SemaphoreService {
  private sem;

  constructor() {
    this.sem = semaphore(5); // Limit to 5 concurrent uploads
  }

  acquire(callback: () => void) {
    this.sem.take(callback);
  }

  release() {
    this.sem.leave();
  }
}