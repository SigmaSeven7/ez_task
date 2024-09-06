
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { File } from './file.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  u_id: number;

  @Column()
  u_name: string;

  @OneToMany(() => File, file => file.user)
  files: File[];
}