import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

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
            `${__dirname}/../../**/*.entity{.ts,.js}`,
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