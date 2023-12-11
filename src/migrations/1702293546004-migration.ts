import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702293546004 implements MigrationInterface {
    name = 'Migration1702293546004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_invite" ALTER COLUMN "createdAt" SET DEFAULT NOW()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_invite" ALTER COLUMN "createdAt" DROP DEFAULT`);
    }

}
