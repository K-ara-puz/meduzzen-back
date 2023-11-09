import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1699528893060 implements MigrationInterface {
    name = 'Migration1699528893060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "actionToken" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "actionToken" SET NOT NULL`);
    }

}
