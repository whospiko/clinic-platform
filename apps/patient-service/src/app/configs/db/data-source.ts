import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export default new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: Number(process.env['DB_PORT'] ?? 3306),
  username: process.env['DB_USERNAME'] ?? 'root',
  password: process.env['DB_PASSWORD'] ?? 'root_password',
  database: process.env['DB_NAME'] ?? 'patient_db',
  synchronize: false,
  logging: process.env['TYPEORM_LOGGING'] === 'true',
  timezone: 'Z',
  entities: [
    __dirname +
      '/../../modules/**/infrastructure/persistence/*.orm-entity{.ts,.js}',
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
