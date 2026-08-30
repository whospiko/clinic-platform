import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1788084814924 implements MigrationInterface {
    name = 'AutoMigration1788084814924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`appointment_status_histories\` (\`id\` varchar(36) NOT NULL, \`appointmentId\` varchar(36) NOT NULL, \`fromStatus\` enum ('REQUESTED', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NULL, \`toStatus\` enum ('REQUESTED', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL, \`reason\` text NULL, \`changedAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointments\` (\`id\` varchar(36) NOT NULL, \`appointmentNo\` varchar(50) NOT NULL, \`patientId\` varchar(36) NOT NULL, \`doctorId\` varchar(36) NOT NULL, \`treatmentId\` varchar(36) NULL, \`source\` enum ('RECEPTION', 'ONLINE', 'PHONE', 'WALK_IN') NOT NULL DEFAULT 'RECEPTION', \`status\` enum ('REQUESTED', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'REQUESTED', \`startAt\` datetime NOT NULL, \`endAt\` datetime NOT NULL, \`note\` text NULL, \`cancelReason\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`idx_appointments_doctor_time\` (\`doctorId\`, \`startAt\`, \`endAt\`), UNIQUE INDEX \`IDX_c4c05338ba237bef58129d4c0a\` (\`appointmentNo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`appointment_status_histories\` ADD CONSTRAINT \`FK_f098c6c56e9be8585db47490787\` FOREIGN KEY (\`appointmentId\`) REFERENCES \`appointments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`appointment_status_histories\` DROP FOREIGN KEY \`FK_f098c6c56e9be8585db47490787\``);
        await queryRunner.query(`DROP INDEX \`IDX_c4c05338ba237bef58129d4c0a\` ON \`appointments\``);
        await queryRunner.query(`DROP INDEX \`idx_appointments_doctor_time\` ON \`appointments\``);
        await queryRunner.query(`DROP TABLE \`appointments\``);
        await queryRunner.query(`DROP TABLE \`appointment_status_histories\``);
    }

}
