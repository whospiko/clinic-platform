import { PatientEmergencyContactReadModel } from '../../application/dto/patient-emergency-contact-read-model';
import { PatientEmergencyContactAggregate } from '../../domain/patient-emergency-contact.aggregate';
import { PatientEmergencyContactOrmEntity } from './patient-emergency-contact.orm-entity';

export class PatientEmergencyContactMapper {
  static toOrm(
    domain: PatientEmergencyContactAggregate,
  ): PatientEmergencyContactOrmEntity {
    const props = domain.toPrimitives();
    const orm = new PatientEmergencyContactOrmEntity();
    Object.assign(orm, props);
    return orm;
  }

  static toDomain(
    orm: PatientEmergencyContactOrmEntity,
  ): PatientEmergencyContactAggregate {
    return new PatientEmergencyContactAggregate({
      id: orm.id,
      patientId: orm.patientId,
      fullName: orm.fullName,
      relationship: orm.relationship,
      phone: orm.phone,
      email: orm.email,
      address: orm.address,
      isPrimary: orm.isPrimary,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toReadModel(
    domain: PatientEmergencyContactAggregate,
  ): PatientEmergencyContactReadModel {
    return {
      id: domain.id,
      patientId: domain.patientId,
      fullName: domain.fullName,
      relationship: domain.relationship,
      phone: domain.phone,
      email: domain.email,
      address: domain.address,
      isPrimary: domain.isPrimary,
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
    };
  }
}
