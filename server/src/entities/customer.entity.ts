// src/entities/customer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { File } from './file.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  c_id: number;

  @Column()
  c_name: string;

  @Column()
  c_email: string;

  @Column()
  c_israeli_id: string;

  @Column()
  c_phone: string;

  @OneToMany(() => File, file => file.customer)
  files: File[];
}