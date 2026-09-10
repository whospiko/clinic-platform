import { PatientNoteReadModel } from '../../application/dto/patient-note-read-model';
import { PatientNoteAggregate } from '../../domain/patient-note.aggregate';
import { PatientNoteOrmEntity } from './patient-note.orm-entity';

export class PatientNoteMapper {
  static toOrm(domain: PatientNoteAggregate): PatientNoteOrmEntity {
    const props = domain.toPrimitives();
    const orm = new PatientNoteOrmEntity();
    Object.assign(orm, props);
    return orm;
  }

  static toDomain(orm: PatientNoteOrmEntity): PatientNoteAggregate {
    return new PatientNoteAggregate({
      id: orm.id,
      patientId: orm.patientId,
      authorId: orm.authorId,
      type: orm.type,
      visibility: orm.visibility,
      content: orm.content,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toReadModel(domain: PatientNoteAggregate): PatientNoteReadModel {
    return {
      id: domain.id,
      patientId: domain.patientId,
      authorId: domain.authorId,
      type: domain.type,
      visibility: domain.visibility,
      content: domain.content,
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
    };
  }
}
