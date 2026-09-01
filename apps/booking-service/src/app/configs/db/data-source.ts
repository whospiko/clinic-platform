import 'dotenv/config';
import { DataSource } from 'typeorm';

import { AppointmentOrmEntity } from '../../modules/appointment/infrastructure/persistence/appointment.entity';
import { AppointmentStatusHistoryOrmEntity } from '../../modules/appointment/infrastructure/persistence/appointment-status-history.entity';
import { ScheduleTemplateOrmEntity } from '../../modules/schedule/infrastructure/persistence/schedule-template.entity';
import { WorkingWindowOrmEntity } from '../../modules/schedule/infrastructure/persistence/working-window.entity';
import { BreakTimeOrmEntity } from '../../modules/schedule/infrastructure/persistence/break-time.entity';
import { ScheduleOverrideOrmEntity } from '../../modules/schedule/infrastructure/persistence/schedule-override.entity';
import { DentalChairOrmEntity } from '../../modules/resource/infrastructure/persistence/dental-chair.orm-entity';

export default new DataSource({
  type: 'mysql',

  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'clinic',
  password: process.env.DB_PASSWORD ?? 'clinic_password',
  database: process.env.DB_NAME ?? 'booking_db',

  entities: [
    AppointmentOrmEntity,
    AppointmentStatusHistoryOrmEntity,
    ScheduleTemplateOrmEntity,
    WorkingWindowOrmEntity,
    BreakTimeOrmEntity,
    ScheduleOverrideOrmEntity,
    DentalChairOrmEntity,
  ],

  migrations: [
    'apps/booking-service/src/app/configs/db/migrations/*.ts',
  ],

  synchronize: false,
  logging: true,
});