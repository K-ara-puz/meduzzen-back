import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1699623923734 implements MigrationInterface {
    name = 'Migration1699623923734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accessToken" character varying NOT NULL, "actionToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(), "deleted_at" TIMESTAMP NOT NULL DEFAULT NOW(), "userIdId" uuid, CONSTRAINT "REL_5673d2e62f0346a9dc4abcc1f5" UNIQUE ("userIdId"), CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_5673d2e62f0346a9dc4abcc1f58" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_5673d2e62f0346a9dc4abcc1f58"`);
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
