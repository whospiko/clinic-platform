import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AppointmentOrmEntity } from '../../modules/appointment/infrastructure/persistence/appointment.entity';
import { AppointmentStatusHistoryOrmEntity } from '../../modules/appointment/infrastructure/persistence/appointment-status-history.entity';
import { ScheduleOverrideOrmEntity } from '../../modules/schedule/infrastructure/persistence/schedule-override.entity';
import { BreakTimeOrmEntity } from '../../modules/schedule/infrastructure/persistence/break-time.entity';
import { WorkingWindowOrmEntity } from '../../modules/schedule/infrastructure/persistence/working-window.entity';
import { ScheduleTemplateOrmEntity } from '../../modules/schedule/infrastructure/persistence/schedule-template.entity';
import { DentalChairOrmEntity } from '../../modules/resource/infrastructure/persistence/dental-chair.orm-entity';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DataSource,
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<DataSource> => {
        const dataSource = new DataSource({
          type: 'mysql',

          host: configService.getOrThrow<string>('DB_HOST'),
          port: Number(configService.getOrThrow<string>('DB_PORT')),
          username: configService.getOrThrow<string>('DB_USERNAME'),
          password: configService.getOrThrow<string>('DB_PASSWORD'),
          database: configService.getOrThrow<string>('DB_NAME'),

          synchronize: false,

          entities: [
            AppointmentOrmEntity,
            AppointmentStatusHistoryOrmEntity,
            ScheduleTemplateOrmEntity,
            WorkingWindowOrmEntity,
            BreakTimeOrmEntity,
            ScheduleOverrideOrmEntity,
            DentalChairOrmEntity,
          ],
        });

        await dataSource.initialize();

        return dataSource;
      },
    },
  ],
  exports: [DataSource],
})
export class DatabaseModule {}