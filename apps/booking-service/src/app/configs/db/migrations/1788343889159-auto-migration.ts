import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1788343889159 implements MigrationInterface {
    name = 'AutoMigration1788343889159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`waitlist_entries\` (\`id\` varchar(36) NOT NULL, \`clinic_id\` varchar(36) NULL, \`doctor_id\` varchar(36) NOT NULL, \`patient_id\` varchar(36) NOT NULL, \`resource_id\` varchar(36) NULL, \`preferred_start_at\` datetime(6) NOT NULL, \`preferred_end_at\` datetime(6) NOT NULL, \`requested_duration_minutes\` int NOT NULL, \`status\` varchar(30) NOT NULL, \`priority\` int NOT NULL DEFAULT '0', \`reason\` varchar(255) NULL, \`offered_start_at\` datetime(6) NULL, \`offered_end_at\` datetime(6) NULL, \`offered_resource_id\` varchar(36) NULL, \`appointment_hold_id\` varchar(36) NULL, \`offer_expires_at\` datetime(6) NULL, \`booked_appointment_id\` varchar(36) NULL, \`cancelled_reason\` varchar(255) NULL, \`cancelled_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`idx_waitlist_entries_offer_expiry\` (\`status\`, \`offer_expires_at\`), INDEX \`idx_waitlist_entries_patient_status\` (\`patient_id\`, \`status\`), INDEX \`idx_waitlist_entries_status_doctor_range\` (\`status\`, \`doctor_id\`, \`preferred_start_at\`, \`preferred_end_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`idx_waitlist_entries_status_doctor_range\` ON \`waitlist_entries\``);
        await queryRunner.query(`DROP INDEX \`idx_waitlist_entries_patient_status\` ON \`waitlist_entries\``);
        await queryRunner.query(`DROP INDEX \`idx_waitlist_entries_offer_expiry\` ON \`waitlist_entries\``);
        await queryRunner.query(`DROP TABLE \`waitlist_entries\``);
    }

}
