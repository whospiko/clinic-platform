import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1788342515917 implements MigrationInterface {
    name = 'AutoMigration1788342515917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`appointment_holds\` (\`id\` varchar(36) NOT NULL, \`clinic_id\` varchar(36) NULL, \`doctor_id\` varchar(36) NOT NULL, \`patient_id\` varchar(36) NULL, \`resource_id\` varchar(36) NULL, \`appointment_id\` varchar(36) NULL, \`start_at\` datetime(3) NOT NULL, \`end_at\` datetime(3) NOT NULL, \`expires_at\` datetime(3) NOT NULL, \`status\` varchar(30) NOT NULL, \`reason\` varchar(255) NULL, \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), INDEX \`idx_appointment_holds_status_expires\` (\`status\`, \`expires_at\`), INDEX \`idx_appointment_holds_resource_time\` (\`resource_id\`, \`start_at\`, \`end_at\`), INDEX \`idx_appointment_holds_doctor_time\` (\`doctor_id\`, \`start_at\`, \`end_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`idx_appointment_holds_doctor_time\` ON \`appointment_holds\``);
        await queryRunner.query(`DROP INDEX \`idx_appointment_holds_resource_time\` ON \`appointment_holds\``);
        await queryRunner.query(`DROP INDEX \`idx_appointment_holds_status_expires\` ON \`appointment_holds\``);
        await queryRunner.query(`DROP TABLE \`appointment_holds\``);
    }

}
