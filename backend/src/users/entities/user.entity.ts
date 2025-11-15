import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export enum UserRole {
  SOCIO = 'SOCIO',
  ADMIN = 'ADMIN',
  ENTRENADOR = 'ENTRENADOR',
  RECEPCIONISTA = 'RECEPCIONISTA',
}

export enum UserStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SOCIO,
  })
  rol: UserRole;

  @Column({ unique: true })
  qrCode: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVO,
  })
  estado: UserStatus;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: Date;

  @CreateDateColumn()
  fechaRegistro: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async generateQrCode() {
    if (!this.qrCode) {
      this.qrCode = uuidv4();
    }
  }

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
