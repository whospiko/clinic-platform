import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialtyService } from './application/specialty.service';
import { SpecialtyRepository } from './application/ports/specialty.repository';
import { SpecialtyOrmEntity } from './infrastructure/persistence/specialty.orm-entity';
import { TypeOrmSpecialtyRepository } from './infrastructure/persistence/typeorm-specialty.repository';
import { SpecialtyController } from './presentation/specialty.controller';
@Module({
  imports: [TypeOrmModule.forFeature([SpecialtyOrmEntity])],
  controllers: [SpecialtyController],
  providers: [
    SpecialtyService,
    { provide: SpecialtyRepository, useClass: TypeOrmSpecialtyRepository },
  ],
  exports: [SpecialtyService, SpecialtyRepository],
})
export class SpecialtyModule {}
