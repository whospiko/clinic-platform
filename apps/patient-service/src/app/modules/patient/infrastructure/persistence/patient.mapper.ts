import {
  PatientReadModel,
  PatientSummaryReadModel,
} from '../../application/dto/patient-read-model';
import { PatientAggregate } from '../../domain/patient.aggregate';
import { PatientOrmEntity } from './patient.orm-entity';

export class PatientMapper {
  static toOrm(domain: PatientAggregate): PatientOrmEntity {
    const props = domain.toPrimitives();
    const orm = new PatientOrmEntity();
    Object.assign(orm, props);
    return orm;
  }

  static toDomain(orm: PatientOrmEntity): PatientAggregate {
    return new PatientAggregate({
      id: orm.id,
      code: orm.code,
      firstName: orm.firstName,
      lastName: orm.lastName,
      fullName: orm.fullName,
      gender: orm.gender,
      dateOfBirth: orm.dateOfBirth,
      phone: orm.phone,
      email: orm.email,
      nationalId: orm.nationalId,
      status: orm.status,
      remark: orm.remark,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toReadModel(domain: PatientAggregate): PatientReadModel {
    return {
      id: domain.id,
      code: domain.code,
      firstName: domain.firstName,
      lastName: domain.lastName,
      fullName: domain.fullName,
      gender: domain.gender,
      dateOfBirth: domain.dateOfBirth,
      phone: domain.phone,
      email: domain.email,
      nationalId: domain.nationalId,
      status: domain.status,
      remark: domain.remark,
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
    };
  }

  static toSummary(orm: PatientOrmEntity): PatientSummaryReadModel {
    return {
      id: orm.id,
      code: orm.code,
      fullName: orm.fullName,
      phone: orm.phone,
      email: orm.email,
      status: orm.status,
    };
  }
}
