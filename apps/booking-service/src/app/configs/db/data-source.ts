import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as path from 'node:path';
import { bookingMigrations } from './migrations';

const isTsRuntime = __filename.endsWith('.ts');

const entitiesGlob = isTsRuntime
  ? path.join(
      process.cwd(),
      'apps/booking-service/src/app/modules/**/infrastructure/persistence/*.entity.ts',
    )
  : path.join(
      __dirname,
      '../../modules/**/infrastructure/persistence/*.entity.js',
    );

const migrationsGlob = isTsRuntime
  ? path.join(__dirname, 'migrations/*.ts')
  : path.join(__dirname, 'migrations/*.js');

export default new DataSource({
  type: 'mysql',

  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'clinic',
  password: process.env.DB_PASSWORD ?? 'clinic_password',
  database: process.env.DB_NAME ?? 'booking_db',

  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',

  entities: [entitiesGlob],

  migrations:
    process.env.TYPEORM_MIGRATION_MODE === 'bundle'
      ? bookingMigrations
      : [migrationsGlob],
});
