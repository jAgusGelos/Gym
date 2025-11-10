import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Routine } from './routine.entity';

@Entity('user_favorite_routines')
export class UserFavoriteRoutine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Routine)
  @JoinColumn({ name: 'routineId' })
  routine: Routine;

  @Column()
  routineId: string;

  @CreateDateColumn()
  createdAt: Date;
}
