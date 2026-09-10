import 'dotenv/config';
import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { DoctorOrmEntity } from '../../../modules/doctor/infrastructure/persistence/doctor.orm-entity';
import { SpecialtyOrmEntity } from '../../../modules/specialty/infrastructure/persistence/specialty.orm-entity';
import { DoctorSpecialtyOrmEntity } from '../../../modules/doctor-specialty/infrastructure/persistence/doctor-specialty.orm-entity';
import { DoctorClinicAssignmentOrmEntity } from '../../../modules/doctor-clinic-assignment/infrastructure/persistence/doctor-clinic-assignment.orm-entity';
import { DoctorCredentialOrmEntity } from '../../../modules/doctor-credential/infrastructure/persistence/doctor-credential.orm-entity';

const AppDataSource = new DataSource({
  type: 'mysql',

  host: process.env['DOCTOR_DB_HOST'] ?? '127.0.0.1',
  port: Number(process.env['DOCTOR_DB_PORT'] ?? 3306),

  username: process.env['DOCTOR_DB_USER'] ?? 'doctor_user',
  password: process.env['DOCTOR_DB_PASSWORD'] ?? 'doctor@1234',
  database: process.env['DOCTOR_DB_NAME'] ?? 'doctor_db',

  charset: 'utf8mb4',

  synchronize: false,
  logging: process.env['NODE_ENV'] === 'development',

  entities: [
    DoctorOrmEntity,
    SpecialtyOrmEntity,
    DoctorSpecialtyOrmEntity,
    DoctorClinicAssignmentOrmEntity,
    DoctorCredentialOrmEntity,
  ],

  migrations: [
    __dirname + '/migrations/*{.ts,.js}',
  ],

  migrationsTableName: 'typeorm_migrations',
});

export default AppDataSource;