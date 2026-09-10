import { PatientContactReadModel } from '../../application/dto/patient-contact-read-model';
import { PatientContactAggregate } from '../../domain/patient-contact.aggregate';
import { PatientContactOrmEntity } from './patient-contact.orm-entity';

export class PatientContactMapper {
  static toOrm(domain: PatientContactAggregate): PatientContactOrmEntity {
    const props = domain.toPrimitives();
    const orm = new PatientContactOrmEntity();
    Object.assign(orm, props);
    return orm;
  }

  static toDomain(orm: PatientContactOrmEntity): PatientContactAggregate {
    return new PatientContactAggregate({
      id: orm.id,
      patientId: orm.patientId,
      type: orm.type,
      value: orm.value,
      label: orm.label,
      isPrimary: orm.isPrimary,
      verifiedAt: orm.verifiedAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toReadModel(domain: PatientContactAggregate): PatientContactReadModel {
    return {
      id: domain.id,
      patientId: domain.patientId,
      type: domain.type,
      value: domain.value,
      label: domain.label,
      isPrimary: domain.isPrimary,
      verifiedAt: domain.verifiedAt?.toISOString() ?? null,
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
    };
  }
}
