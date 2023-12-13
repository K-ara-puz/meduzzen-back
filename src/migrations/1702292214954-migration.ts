import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702292214954 implements MigrationInterface {
    name = 'Migration1702292214954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company_invite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "userFromIdId" uuid, "targetUserIdId" uuid, "companyIdId" uuid, CONSTRAINT "PK_7c86e1788d1bb358b229beb9c18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "company_invite" ADD CONSTRAINT "FK_d07b15f890c0924120db3d3c2bb" FOREIGN KEY ("userFromIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_invite" ADD CONSTRAINT "FK_32d142e4ef47a9a9821c80772a2" FOREIGN KEY ("targetUserIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_invite" ADD CONSTRAINT "FK_53515a5ec5d8fcaff54173060be" FOREIGN KEY ("companyIdId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_invite" DROP CONSTRAINT "FK_53515a5ec5d8fcaff54173060be"`);
        await queryRunner.query(`ALTER TABLE "company_invite" DROP CONSTRAINT "FK_32d142e4ef47a9a9821c80772a2"`);
        await queryRunner.query(`ALTER TABLE "company_invite" DROP CONSTRAINT "FK_d07b15f890c0924120db3d3c2bb"`);
        await queryRunner.query(`DROP TABLE "company_invite"`);
    }

}
