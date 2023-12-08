import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702040775841 implements MigrationInterface {
    name = 'Migration1702040775841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_member" DROP CONSTRAINT "FK_b29b4395b5d9a2953c08dc089ef"`);
        await queryRunner.query(`ALTER TABLE "company_member" ADD CONSTRAINT "FK_b29b4395b5d9a2953c08dc089ef" FOREIGN KEY ("companyIdId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_member" DROP CONSTRAINT "FK_b29b4395b5d9a2953c08dc089ef"`);
        await queryRunner.query(`ALTER TABLE "company_member" ADD CONSTRAINT "FK_b29b4395b5d9a2953c08dc089ef" FOREIGN KEY ("companyIdId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
