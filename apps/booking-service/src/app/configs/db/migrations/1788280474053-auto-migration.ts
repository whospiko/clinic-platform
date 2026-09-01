import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1788280474053 implements MigrationInterface {
    name = 'AutoMigration1788280474053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`doctor_working_windows\` (\`id\` varchar(255) NOT NULL, \`template_id\` varchar(255) NOT NULL, \`day_of_week\` tinyint NOT NULL, \`start_time\` varchar(5) NOT NULL, \`end_time\` varchar(5) NOT NULL, \`slot_duration_minutes\` int NOT NULL, \`capacity\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`doctor_break_times\` (\`id\` varchar(255) NOT NULL, \`template_id\` varchar(255) NOT NULL, \`day_of_week\` tinyint NOT NULL, \`start_time\` varchar(5) NOT NULL, \`end_time\` varchar(5) NOT NULL, \`reason\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`doctor_schedule_templates\` (\`id\` varchar(255) NOT NULL, \`doctor_id\` varchar(255) NOT NULL, \`clinic_id\` varchar(255) NULL, \`timezone\` varchar(80) NOT NULL, \`effective_from\` date NOT NULL, \`effective_to\` date NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`doctor_schedule_overrides\` (\`id\` varchar(255) NOT NULL, \`doctor_id\` varchar(255) NOT NULL, \`clinic_id\` varchar(255) NULL, \`date\` date NOT NULL, \`type\` enum ('CLOSED_DAY', 'EXTRA_WORKING_TIME', 'CUSTOM_BREAK') NOT NULL, \`start_time\` varchar(5) NULL, \`end_time\` varchar(5) NULL, \`reason\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`doctor_working_windows\` ADD CONSTRAINT \`FK_dd9935fc35dbf2310fa6f56a7a4\` FOREIGN KEY (\`template_id\`) REFERENCES \`doctor_schedule_templates\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doctor_break_times\` ADD CONSTRAINT \`FK_2acd61d8216584316a97d05f3c1\` FOREIGN KEY (\`template_id\`) REFERENCES \`doctor_schedule_templates\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doctor_break_times\` DROP FOREIGN KEY \`FK_2acd61d8216584316a97d05f3c1\``);
        await queryRunner.query(`ALTER TABLE \`doctor_working_windows\` DROP FOREIGN KEY \`FK_dd9935fc35dbf2310fa6f56a7a4\``);
        await queryRunner.query(`DROP TABLE \`doctor_schedule_overrides\``);
        await queryRunner.query(`DROP TABLE \`doctor_schedule_templates\``);
        await queryRunner.query(`DROP TABLE \`doctor_break_times\``);
        await queryRunner.query(`DROP TABLE \`doctor_working_windows\``);
    }

}
