import { DoctorAggregate } from '../../domain/doctor.aggregate';
import { DoctorOrmEntity } from './doctor.orm-entity';

export class DoctorMapper {
  static toDomain(e: DoctorOrmEntity): DoctorAggregate {
    return DoctorAggregate.rehydrate({
      id: e.id,
      userId: e.userId,
      employeeCode: e.employeeCode,
      firstName: e.firstName,
      lastName: e.lastName,
      displayName: e.displayName,
      gender: e.gender,
      dateOfBirth: e.dateOfBirth
        ? new Date(`${e.dateOfBirth}T00:00:00.000Z`)
        : null,
      phone: e.phone,
      email: e.email,
      bio: e.bio,
      yearsExperience: e.yearsExperience,
      status: e.status,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    });
  }

  static toOrm(d: DoctorAggregate): DoctorOrmEntity {
    const x = d.snapshot;
    const e = new DoctorOrmEntity();
    e.id = x.id;
    e.userId = x.userId;
    e.employeeCode = x.employeeCode;
    e.firstName = x.firstName;
    e.lastName = x.lastName;
    e.displayName = x.displayName;
    e.gender = x.gender;
    e.dateOfBirth = x.dateOfBirth?.toISOString().slice(0, 10) ?? null;
    e.phone = x.phone;
    e.email = x.email;
    e.bio = x.bio;
    e.yearsExperience = x.yearsExperience;
    e.status = x.status;
    e.createdAt = x.createdAt;
    e.updatedAt = x.updatedAt;
    return e;
  }
}
