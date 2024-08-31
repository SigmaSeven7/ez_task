// src/entities/file.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Customer } from './customer.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  f_id: number;

  @Column()
  f_name: string;

  @Column()
  f_path: string;

  @Column()
  uploaded_at: Date;

  @ManyToOne(() => User, user => user.files)
  @JoinColumn({ name: 'u_id' })
  user: User;

  @ManyToOne(() => Customer, customer => customer.files)
  @JoinColumn({ name: 'c_id' })
  customer: Customer;
}