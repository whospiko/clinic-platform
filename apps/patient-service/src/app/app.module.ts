import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PatientAddressModule } from './modules/patient-address/patient-address.module';
import { PatientContactModule } from './modules/patient-contact/patient-contact.module';
import { PatientEmergencyContactModule } from './modules/patient-emergency-contact/patient-emergency-contact.module';
import { PatientNoteModule } from './modules/patient-note/patient-note.module';
import { PatientModule } from './modules/patient/patient.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT') ?? 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', 'root_password'),
        database: config.get<string>('DB_NAME', 'patient_db'),
        autoLoadEntities: true,
        synchronize: false,
        timezone: 'Z',
        logging: config.get<string>('TYPEORM_LOGGING', 'false') === 'true',
        extra: {
          connectionLimit: Number(config.get<string>('DB_POOL_SIZE') ?? 10),
        },
      }),
    }),
    PatientModule,
    PatientContactModule,
    PatientAddressModule,
    PatientEmergencyContactModule,
    PatientNoteModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
