import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MembershipType } from '../../memberships/entities/membership.entity';

@Entity('membership_plans')
export class MembershipPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: MembershipType,
  })
  tipo: MembershipType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'int' })
  duracionDias: number;

  @Column({ type: 'simple-array', nullable: true })
  beneficios: string[];

  @Column({ default: true })
  activo: boolean;

  @Column({ default: false })
  destacado: boolean;

  @Column({ type: 'int', default: 0 })
  orden: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
