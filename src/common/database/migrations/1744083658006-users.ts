import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1744083658006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) NOT NULL,
        first_name VARCHAR(50) NULL,
        last_name VARCHAR(50) NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(16) NOT NULL DEFAULT 'BASIC',
        verified_at TIMESTAMP NULL,
        otp_code VARCHAR(10) NULL,
        otp_expires_at TIMESTAMP NULL,
        deleted_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
        ) ENGINE = InnoDB;
        `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
