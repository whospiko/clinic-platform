import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePatientServiceTables1720000000000
  implements MigrationInterface
{
  name = 'CreatePatientServiceTables1720000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE patient_profiles (
        id varchar(36) NOT NULL,
        code varchar(50) NOT NULL,
        first_name varchar(100) NOT NULL,
        last_name varchar(100) NULL,
        full_name varchar(220) NOT NULL,
        gender varchar(20) NOT NULL DEFAULT 'UNKNOWN',
        date_of_birth date NULL,
        phone varchar(30) NULL,
        email varchar(150) NULL,
        national_id varchar(100) NULL,
        status varchar(30) NOT NULL DEFAULT 'ACTIVE',
        remark text NULL,
        created_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        UNIQUE INDEX uq_patient_profiles_code (code),
        INDEX idx_patient_profiles_name (full_name),
        INDEX idx_patient_profiles_phone (phone),
        INDEX idx_patient_profiles_status (status),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE patient_contacts (
        id varchar(36) NOT NULL,
        patient_id varchar(36) NOT NULL,
        type varchar(30) NOT NULL,
        value varchar(180) NOT NULL,
        label varchar(80) NULL,
        is_primary tinyint NOT NULL DEFAULT 0,
        verified_at datetime(3) NULL,
        created_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        INDEX idx_patient_contacts_patient_type (patient_id, type),
        INDEX idx_patient_contacts_value (value),
        PRIMARY KEY (id),
        CONSTRAINT fk_patient_contacts_patient FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE patient_addresses (
        id varchar(36) NOT NULL,
        patient_id varchar(36) NOT NULL,
        type varchar(30) NOT NULL,
        line1 varchar(255) NOT NULL,
        line2 varchar(255) NULL,
        commune varchar(120) NULL,
        district varchar(120) NULL,
        province varchar(120) NULL,
        country varchar(120) NOT NULL DEFAULT 'Cambodia',
        postal_code varchar(30) NULL,
        latitude decimal(10,7) NULL,
        longitude decimal(10,7) NULL,
        is_primary tinyint NOT NULL DEFAULT 0,
        created_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        INDEX idx_patient_addresses_patient_type (patient_id, type),
        PRIMARY KEY (id),
        CONSTRAINT fk_patient_addresses_patient FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE patient_emergency_contacts (
        id varchar(36) NOT NULL,
        patient_id varchar(36) NOT NULL,
        full_name varchar(180) NOT NULL,
        relationship varchar(80) NOT NULL,
        phone varchar(30) NOT NULL,
        email varchar(150) NULL,
        address varchar(255) NULL,
        is_primary tinyint NOT NULL DEFAULT 0,
        created_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        INDEX idx_patient_emergency_contacts_patient (patient_id),
        INDEX idx_patient_emergency_contacts_phone (phone),
        PRIMARY KEY (id),
        CONSTRAINT fk_patient_emergency_contacts_patient FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE patient_notes (
        id varchar(36) NOT NULL,
        patient_id varchar(36) NOT NULL,
        author_id varchar(36) NULL,
        type varchar(30) NOT NULL DEFAULT 'GENERAL',
        visibility varchar(30) NOT NULL DEFAULT 'INTERNAL',
        content text NOT NULL,
        created_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        deleted_at datetime(3) NULL,
        INDEX idx_patient_notes_patient_type (patient_id, type),
        INDEX idx_patient_notes_author (author_id),
        INDEX idx_patient_notes_deleted (deleted_at),
        PRIMARY KEY (id),
        CONSTRAINT fk_patient_notes_patient FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE patient_notes');
    await queryRunner.query('DROP TABLE patient_emergency_contacts');
    await queryRunner.query('DROP TABLE patient_addresses');
    await queryRunner.query('DROP TABLE patient_contacts');
    await queryRunner.query('DROP TABLE patient_profiles');
  }
}
