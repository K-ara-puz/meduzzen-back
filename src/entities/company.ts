import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({default: null})
  description: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}