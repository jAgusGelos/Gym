import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ExercisesService } from '../exercises/exercises.service';
import { AchievementsService } from '../achievements/achievements.service';
import { ClassesService } from '../classes/classes.service';
import { MembershipsService } from '../memberships/memberships.service';
import { UserRole, User } from '../users/entities/user.entity';
import { MuscleGroup, DifficultyLevel } from '../exercises/entities/exercise.entity';
import { MembershipType, PaymentMethod } from '../memberships/entities/membership.entity';
import { DataSource } from 'typeorm';
import { achievementsSeed } from '../achievements/achievements.seed';
import { Achievement } from '../achievements/entities/achievement.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const exercisesService = app.get(ExercisesService);
  const achievementsService = app.get(AchievementsService);
  const classesService = app.get(ClassesService);
  const membershipsService = app.get(MembershipsService);
  const dataSource = app.get(DataSource);

  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Crear usuarios
    console.log('👥 Creating users...');

    const admin = await usersService.create({
      email: 'admin@gym.com',
      password: 'Admin123!',
      nombre: 'Admin',
      apellido: 'Principal',
      rol: UserRole.ADMIN,
      telefono: '+54 11 1234-5678',
    });
    console.log('✅ Admin created:', admin.email);

    const trainer1 = await usersService.create({
      email: 'trainer@gym.com',
      password: 'Trainer123!',
      nombre: 'Carlos',
      apellido: 'Pérez',
      rol: UserRole.ENTRENADOR,
      telefono: '+54 11 2345-6789',
    });
    console.log('✅ Trainer created:', trainer1.email);

    const trainer2 = await usersService.create({
      email: 'maria.trainer@gym.com',
      password: 'Trainer123!',
      nombre: 'María',
      apellido: 'González',
      rol: UserRole.ENTRENADOR,
      telefono: '+54 11 3456-7890',
    });
    console.log('✅ Trainer created:', trainer2.email);

    const recepcionista = await usersService.create({
      email: 'recepcion@gym.com',
      password: 'Recep123!',
      nombre: 'Laura',
      apellido: 'Martínez',
      rol: UserRole.RECEPCIONISTA,
      telefono: '+54 11 4567-8901',
    });
    console.log('✅ Receptionist created:', recepcionista.email);

    // Crear varios socios
    const socios: User[] = [];
    const nombresM = ['Juan', 'Diego', 'Lucas', 'Mateo', 'Santiago'];
    const nombresF = ['Ana', 'Sofia', 'Valentina', 'Emma', 'Isabella'];
    const apellidos = ['García', 'Rodríguez', 'López', 'Fernández', 'Martínez', 'Sánchez', 'Torres', 'Ramírez'];

    for (let i = 0; i < 10; i++) {
      const esMasculino = i % 2 === 0;
      const nombre = esMasculino ? nombresM[i % nombresM.length] : nombresF[i % nombresF.length];
      const apellido = apellidos[i % apellidos.length];

      const socio = await usersService.create({
        email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@example.com`,
        password: 'Socio123!',
        nombre,
        apellido,
        rol: UserRole.SOCIO,
        telefono: `+54 11 ${5000 + i}${1000 + i}`,
      });
      socios.push(socio);
    }
    console.log(`✅ Created ${socios.length} members\n`);

    // 2. Crear membresías para algunos socios
    console.log('🎫 Creating memberships for members...');

    for (let i = 0; i < 5; i++) {
      const socio = socios[i];
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - Math.floor(Math.random() * 30));

      await membershipsService.create({
        userId: socio.id,
        tipo: i % 2 === 0 ? MembershipType.MENSUAL : MembershipType.TRIMESTRAL,
        fechaInicio: fechaInicio.toISOString(),
        precio: i % 2 === 0 ? 15000 : 40000,
        metodoPago: PaymentMethod.EFECTIVO,
        notas: 'Membresía de prueba',
      });
    }
    console.log(`✅ Created memberships for 5 members\n`);

    // 3. Crear ejercicios
    console.log('💪 Creating exercises...');

    const ejercicios = [
      // Pecho
      {
        nombre: 'Press de Banca',
        descripcion: 'Ejercicio compuesto para desarrollar el pecho, hombros y tríceps',
        grupoMuscular: MuscleGroup.PECHO,
        equipamiento: 'Barra y banco',
        nivelDificultad: DifficultyLevel.INTERMEDIO,
      },
      {
        nombre: 'Press Inclinado con Mancuernas',
        descripcion: 'Trabaja la parte superior del pecho',
        grupoMuscular: MuscleGroup.PECHO,
        equipamiento: 'Mancuernas y banco inclinado',
        nivelDificultad: DifficultyLevel.INTERMEDIO,
      },
      {
        nombre: 'Aperturas con Mancuernas',
        descripcion: 'Ejercicio de aislamiento para el pecho',
        grupoMuscular: MuscleGroup.PECHO,
        equipamiento: 'Mancuernas y banco',
        nivelDificultad: DifficultyLevel.PRINCIPIANTE,
      },
      // Espalda
      {
        nombre: 'Dominadas',
        descripcion: 'Ejercicio compuesto para toda la espalda',
        grupoMuscular: MuscleGroup.ESPALDA,
        equipamiento: 'Barra de dominadas',
        nivelDificultad: DifficultyLevel.AVANZADO,
      },
      {
        nombre: 'Remo con Barra',
        descripcion: 'Ejercicio fundamental para el grosor de la espalda',
        grupoMuscular: MuscleGroup.ESPALDA,
        equipamiento: 'Barra',
        nivelDificultad: DifficultyLevel.INTERMEDIO,
      },
      {
        nombre: 'Jalón al Pecho',
        descripcion: 'Trabaja el ancho de la espalda',
        grupoMuscular: MuscleGroup.ESPALDA,
        equipamiento: 'Polea alta',
        nivelDificultad: DifficultyLevel.PRINCIPIANTE,
      },
      // Piernas
      {
        nombre: 'Sentadilla con Barra',
        descripcion: 'El rey de los ejercicios de pierna',
        grupoMuscular: MuscleGroup.PIERNAS,
        equipamiento: 'Barra y rack',
        nivelDificultad: DifficultyLevel.INTERMEDIO,
      },
      {
        nombre: 'Peso Muerto',
        descripcion: 'Ejercicio compuesto para piernas y espalda baja',
        grupoMuscular: MuscleGroup.PIERNAS,
        equipamiento: 'Barra',
        nivelDificultad: DifficultyLevel.AVANZADO,
      },
      {
        nombre: 'Prensa de Piernas',
        descripcion: 'Ejercicio de pierna con soporte lumbar',
        grupoMuscular: MuscleGroup.PIERNAS,
        equipamiento: 'Máquina de prensa',
        nivelDificultad: DifficultyLevel.PRINCIPIANTE,
      },
      {
        nombre: 'Zancadas',
        descripcion: 'Ejercicio unilateral para piernas',
        grupoMuscular: MuscleGroup.PIERNAS,
        equipamiento: 'Mancuernas',
        nivelDificultad: DifficultyLevel.INTERMEDIO,
      },
      // Hombros
      {
        nombre: 'Press Militar',
        descripcion: 'Ejercicio compuesto para hombros',
        grupoMuscular: MuscleGroup.HOMBROS,
        equipamiento: 'Barra',
        nivelDificultad: DifficultyLevel.INTERMEDIO,
      },
      {
        nombre: 'Elevaciones Laterales',
        descripcion: 'Aislamiento para deltoides lateral',
        grupoMuscular: MuscleGroup.HOMBROS,
        equipamiento: 'Mancuernas',
        nivelDificultad: DifficultyLevel.PRINCIPIANTE,
      },
      {
        nombre: 'Elevaciones Frontales',
        descripcion: 'Trabaja el deltoides anterior',
        grupoMuscular: MuscleGroup.HOMBROS,
        equipamiento: 'Mancuernas o disco',
        nivelDificultad: DifficultyLevel.PRINCIPIANTE,
      },
      // Brazos
      {
        nombre: 'Curl de Bíceps con Barra',
        descripcion: 'Ejercicio básico para bíceps',
        grupoMuscular: MuscleGroup.BRAZOS,
        equipamiento: 'Barra',
        nivelDificultad: DifficultyLevel.PRINCIPIANTE,
      },
      {
        nombre: 'Curl Martillo',
        descripcion: 'Trabaja bíceps y braquial',
        grupoMuscular: MuscleGroup.BRAZOS,
        equipamiento: 'Mancuernas',
        nivelDificultad: DifficultyLevel.PRINCIPIANTE,
      },
      {
        nombre: 'Press Francés',
        descripcion: 'Ejercicio de aislamiento para tríceps',
        grupoMuscular: MuscleGroup.BRAZOS,
        equipamiento: 'Barra Z',
        nivelDificultad: DifficultyLevel.INTERMEDIO,
      },
      {
        nombre: 'Fondos en Paralelas',
        descripcion: 'Ejercicio compuesto para tríceps y pecho',
        grupoMuscular: MuscleGroup.BRAZOS,
        equipamiento: 'Paralelas',
        nivelDificultad: DifficultyLevel.AVANZADO,
      },
      // Core
      {
        nombre: 'Plancha',
        descripcion: 'Ejercicio isométrico para core',
        grupoMuscular: MuscleGroup.CORE,
        equipamiento: 'Ninguno',
        nivelDificultad: DifficultyLevel.PRINCIPIANTE,
      },
      {
        nombre: 'Abdominales con Peso',
        descripcion: 'Fortalece el recto abdominal',
        grupoMuscular: MuscleGroup.CORE,
        equipamiento: 'Disco o mancuerna',
        nivelDificultad: DifficultyLevel.INTERMEDIO,
      },
      {
        nombre: 'Elevaciones de Piernas',
        descripcion: 'Trabaja abdomen inferior',
        grupoMuscular: MuscleGroup.CORE,
        equipamiento: 'Barra de dominadas',
        nivelDificultad: DifficultyLevel.AVANZADO,
      },
      // Cardio
      {
        nombre: 'Caminata en Cinta',
        descripcion: 'Cardio de baja intensidad',
        grupoMuscular: MuscleGroup.CARDIO,
        equipamiento: 'Cinta de correr',
        nivelDificultad: DifficultyLevel.PRINCIPIANTE,
      },
      {
        nombre: 'Intervalos HIIT',
        descripcion: 'Cardio de alta intensidad',
        grupoMuscular: MuscleGroup.CARDIO,
        equipamiento: 'Ninguno o cinta',
        nivelDificultad: DifficultyLevel.AVANZADO,
      },
    ];

    for (const ejercicio of ejercicios) {
      await exercisesService.create(ejercicio);
    }
    console.log(`✅ Created ${ejercicios.length} exercises\n`);

    // 4. Crear clases grupales
    console.log('🏋️ Creating group classes...');

    const clases = [
      {
        nombre: 'Yoga Flow',
        descripcion: 'Clase de yoga enfocada en flexibilidad y relajación',
        cupoMaximo: 15,
        schedules: [
          {
            dayOfWeek: 1, // Lunes
            startTime: '10:00',
            endTime: '11:00',
            instructorId: trainer1.id,
          },
          {
            dayOfWeek: 3, // Miércoles
            startTime: '10:00',
            endTime: '11:00',
            instructorId: trainer1.id,
          },
          {
            dayOfWeek: 5, // Viernes
            startTime: '10:00',
            endTime: '11:00',
            instructorId: trainer1.id,
          },
        ],
      },
      {
        nombre: 'Spinning',
        descripcion: 'Entrenamiento cardiovascular intenso en bicicleta',
        cupoMaximo: 20,
        schedules: [
          {
            dayOfWeek: 1, // Lunes
            startTime: '18:00',
            endTime: '19:00',
            instructorId: trainer2.id,
          },
          {
            dayOfWeek: 3, // Miércoles
            startTime: '18:00',
            endTime: '19:00',
            instructorId: trainer2.id,
          },
          {
            dayOfWeek: 5, // Viernes
            startTime: '18:00',
            endTime: '19:00',
            instructorId: trainer2.id,
          },
        ],
      },
      {
        nombre: 'Funcional',
        descripcion: 'Entrenamiento funcional de cuerpo completo',
        cupoMaximo: 12,
        schedules: [
          {
            dayOfWeek: 2, // Martes
            startTime: '10:00',
            endTime: '11:00',
            instructorId: trainer1.id,
          },
          {
            dayOfWeek: 4, // Jueves
            startTime: '10:00',
            endTime: '11:00',
            instructorId: trainer1.id,
          },
        ],
      },
      {
        nombre: 'CrossFit',
        descripcion: 'Entrenamiento de alta intensidad variado',
        cupoMaximo: 10,
        schedules: [
          {
            dayOfWeek: 1, // Lunes
            startTime: '19:00',
            endTime: '20:00',
            instructorId: trainer2.id,
          },
          {
            dayOfWeek: 2, // Martes
            startTime: '19:00',
            endTime: '20:00',
            instructorId: trainer2.id,
          },
          {
            dayOfWeek: 3, // Miércoles
            startTime: '19:00',
            endTime: '20:00',
            instructorId: trainer2.id,
          },
          {
            dayOfWeek: 4, // Jueves
            startTime: '19:00',
            endTime: '20:00',
            instructorId: trainer2.id,
          },
          {
            dayOfWeek: 5, // Viernes
            startTime: '19:00',
            endTime: '20:00',
            instructorId: trainer2.id,
          },
        ],
      },
      {
        nombre: 'Pilates',
        descripcion: 'Fortalecimiento del core y mejora de postura',
        cupoMaximo: 15,
        schedules: [
          {
            dayOfWeek: 2, // Martes
            startTime: '08:00',
            endTime: '09:00',
            instructorId: trainer1.id,
          },
          {
            dayOfWeek: 4, // Jueves
            startTime: '08:00',
            endTime: '09:00',
            instructorId: trainer1.id,
          },
        ],
      },
    ];

    for (const clase of clases) {
      await classesService.create(clase);
    }
    console.log(`✅ Created ${clases.length} group classes\n`);

    // 5. Sembrar achievements
    console.log('🏆 Seeding achievements...');
    const achievementRepo = dataSource.getRepository(Achievement);

    for (const achievementData of achievementsSeed) {
      const existing = await achievementRepo.findOne({
        where: { criterio: achievementData.criterio },
      });

      if (!existing) {
        const achievement = achievementRepo.create(achievementData);
        await achievementRepo.save(achievement);
      }
    }
    console.log('✅ Achievements seeded\n');

    console.log('✅ Database seeding completed successfully!\n');
    console.log('📝 Test credentials:');
    console.log('   Admin: admin@gym.com / Admin123!');
    console.log('   Trainer: trainer@gym.com / Trainer123!');
    console.log('   Receptionist: recepcion@gym.com / Recep123!');
    console.log('   Member: juan.garcia@example.com / Socio123!\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
