import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  userId: Partial<User>
  
  @Column()
  accessToken: string;

  @Column({nullable: true})
  actionToken: string;

  @Column()
  refreshToken: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
  
  @Column()
  deleted_at: Date;
}