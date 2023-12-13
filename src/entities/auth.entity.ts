import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  userId: User
  
  @Column()
  accessToken: string;

  @Column()
  actionToken: string;

  @Column()
  refreshToken: string;

  @Column({ default: () => "NOW()" })
  created_at: Date;

  @Column({ default: () => "NOW()" })
  updated_at: Date;
  
  @Column({ default: () => "NOW()" })
  deleted_at: Date;
}