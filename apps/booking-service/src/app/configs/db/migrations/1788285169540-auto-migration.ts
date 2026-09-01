import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1788285169540 implements MigrationInterface {
    name = 'AutoMigration1788285169540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`dental_chairs\` (\`id\` char(36) NOT NULL, \`clinic_id\` char(36) NULL, \`code\` varchar(50) NOT NULL, \`name\` varchar(150) NOT NULL, \`description\` varchar(500) NULL, \`status\` enum ('ACTIVE', 'INACTIVE', 'MAINTENANCE') NOT NULL DEFAULT 'ACTIVE', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`uq_dental_chairs_clinic_code\` (\`clinic_id\`, \`code\`), INDEX \`idx_dental_chairs_status\` (\`status\`), INDEX \`idx_dental_chairs_clinic_id\` (\`clinic_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`idx_dental_chairs_clinic_id\` ON \`dental_chairs\``);
        await queryRunner.query(`DROP INDEX \`idx_dental_chairs_status\` ON \`dental_chairs\``);
        await queryRunner.query(`DROP INDEX \`uq_dental_chairs_clinic_code\` ON \`dental_chairs\``);
        await queryRunner.query(`DROP TABLE \`dental_chairs\``);
    }

}
