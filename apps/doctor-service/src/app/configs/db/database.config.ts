import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function databaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env['DB_HOST'] ?? '127.0.0.1',
    port: Number(process.env['DB_PORT'] ?? 3306),
    username: process.env['DB_USER'] ?? 'doctor_user',
    password: process.env['DB_PASSWORD'] ?? 'doctor@1234',
    database: process.env['DB_NAME'] ?? 'doctor_db',
    autoLoadEntities: true,
    synchronize: false,
    logging: process.env['NODE_ENV'] !== 'production',
    timezone: 'Z',
  };
}
