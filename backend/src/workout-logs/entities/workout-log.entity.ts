import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Routine } from '../../routines/entities/routine.entity';
import { ExerciseSet } from './exercise-set.entity';

@Entity('workout_logs')
export class WorkoutLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  routineId: string;

  @ManyToOne(() => Routine, { nullable: true })
  @JoinColumn({ name: 'routineId' })
  routine: Routine;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ nullable: true })
  titulo: string;

  @Column({ type: 'int', nullable: true })
  duracionMinutos: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @OneToMany(() => ExerciseSet, (set) => set.workoutLog, { cascade: true })
  sets: ExerciseSet[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
