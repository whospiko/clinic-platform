import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateDoctorServiceSchema202609100001
  implements MigrationInterface
{
  name = 'CreateDoctorServiceSchema202609100001';
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE doctors (
      id varchar(36) NOT NULL,
      user_id varchar(36) NULL,
      employee_code varchar(50) NOT NULL,
      first_name varchar(100) NOT NULL,
      last_name varchar(100) NOT NULL,
      display_name varchar(200) NOT NULL,
      gender enum('MALE','FEMALE','OTHER','UNSPECIFIED') NOT NULL DEFAULT 'UNSPECIFIED',
      date_of_birth date NULL,
      phone varchar(30) NULL,
      email varchar(190) NULL,
      bio text NULL,
      years_experience smallint unsigned NOT NULL DEFAULT 0,
      status enum('ACTIVE','INACTIVE','ON_LEAVE') NOT NULL DEFAULT 'ACTIVE',
      created_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id), UNIQUE KEY uq_doctors_employee_code (employee_code), UNIQUE KEY uq_doctors_user_id (user_id), KEY idx_doctors_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await q.query(`CREATE TABLE specialties (
      id varchar(36) NOT NULL, code varchar(50) NOT NULL, name varchar(150) NOT NULL, description text NULL, active tinyint(1) NOT NULL DEFAULT 1,
      created_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), updated_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY(id), UNIQUE KEY uq_specialties_code(code), UNIQUE KEY uq_specialties_name(name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await q.query(`CREATE TABLE doctor_specialties (
      id varchar(36) NOT NULL, doctor_id varchar(36) NOT NULL, specialty_id varchar(36) NOT NULL, is_primary tinyint(1) NOT NULL DEFAULT 0,
      certified_at date NULL, years_experience smallint unsigned NULL, created_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY(id), UNIQUE KEY uq_doctor_specialty(doctor_id,specialty_id), KEY idx_doctor_specialties_doctor(doctor_id), KEY idx_doctor_specialties_specialty(specialty_id),
      CONSTRAINT fk_ds_doctor FOREIGN KEY(doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
      CONSTRAINT fk_ds_specialty FOREIGN KEY(specialty_id) REFERENCES specialties(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await q.query(`CREATE TABLE doctor_clinic_assignments (
      id varchar(36) NOT NULL, doctor_id varchar(36) NOT NULL, clinic_id varchar(36) NOT NULL, title varchar(100) NULL,
      employment_type enum('FULL_TIME','PART_TIME','CONTRACT','VISITING') NOT NULL, is_primary tinyint(1) NOT NULL DEFAULT 0,
      start_date date NOT NULL, end_date date NULL, status enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
      created_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), updated_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY(id), KEY idx_dca_doctor(doctor_id), KEY idx_dca_clinic(clinic_id), KEY idx_dca_doctor_clinic_status(doctor_id,clinic_id,status),
      CONSTRAINT fk_dca_doctor FOREIGN KEY(doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await q.query(`CREATE TABLE doctor_credentials (
      id varchar(36) NOT NULL, doctor_id varchar(36) NOT NULL,
      type enum('MEDICAL_LICENSE','DENTAL_LICENSE','BOARD_CERTIFICATION','DEGREE','TRAINING_CERTIFICATE','OTHER') NOT NULL,
      credential_number varchar(100) NOT NULL, issuer varchar(190) NOT NULL, issued_at date NULL, expires_at date NULL, document_url varchar(500) NULL,
      verification_status enum('PENDING','VERIFIED','REJECTED','EXPIRED') NOT NULL DEFAULT 'PENDING', verified_at datetime(3) NULL, verification_note varchar(500) NULL,
      created_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), updated_at datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY(id), UNIQUE KEY uq_doctor_credential_number(doctor_id,credential_number), KEY idx_doctor_credentials_doctor(doctor_id), KEY idx_doctor_credentials_status(verification_status),
      CONSTRAINT fk_dc_doctor FOREIGN KEY(doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }
  public async down(q: QueryRunner): Promise<void> {
    await q.query('DROP TABLE doctor_credentials');
    await q.query('DROP TABLE doctor_clinic_assignments');
    await q.query('DROP TABLE doctor_specialties');
    await q.query('DROP TABLE specialties');
    await q.query('DROP TABLE doctors');
  }
}
