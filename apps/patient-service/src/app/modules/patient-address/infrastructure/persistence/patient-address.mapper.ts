import { PatientAddressReadModel } from '../../application/dto/patient-address-read-model';
import { PatientAddressAggregate } from '../../domain/patient-address.aggregate';
import { PatientAddressOrmEntity } from './patient-address.orm-entity';

export class PatientAddressMapper {
  static toOrm(domain: PatientAddressAggregate): PatientAddressOrmEntity {
    const orm = new PatientAddressOrmEntity();
    orm.id = domain.id;
    orm.patientId = domain.patientId;
    orm.type = domain.type;
    orm.line1 = domain.line1;
    orm.line2 = domain.line2;
    orm.commune = domain.commune;
    orm.district = domain.district;
    orm.province = domain.province;
    orm.country = domain.country;
    orm.postalCode = domain.postalCode;
    orm.latitude = domain.latitude === null ? null : String(domain.latitude);
    orm.longitude = domain.longitude === null ? null : String(domain.longitude);
    orm.isPrimary = domain.isPrimary;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }

  static toDomain(orm: PatientAddressOrmEntity): PatientAddressAggregate {
    return new PatientAddressAggregate({
      id: orm.id,
      patientId: orm.patientId,
      type: orm.type,
      line1: orm.line1,
      line2: orm.line2,
      commune: orm.commune,
      district: orm.district,
      province: orm.province,
      country: orm.country,
      postalCode: orm.postalCode,
      latitude: orm.latitude === null ? null : Number(orm.latitude),
      longitude: orm.longitude === null ? null : Number(orm.longitude),
      isPrimary: orm.isPrimary,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toReadModel(domain: PatientAddressAggregate): PatientAddressReadModel {
    return {
      id: domain.id,
      patientId: domain.patientId,
      type: domain.type,
      line1: domain.line1,
      line2: domain.line2,
      commune: domain.commune,
      district: domain.district,
      province: domain.province,
      country: domain.country,
      postalCode: domain.postalCode,
      latitude: domain.latitude,
      longitude: domain.longitude,
      isPrimary: domain.isPrimary,
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
    };
  }
}
