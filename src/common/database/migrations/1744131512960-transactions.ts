import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transactions1744131512960 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS transactions (
            id varchar(36) NOT NULL,
            amount decimal(18,8) NOT NULL,
            type enum ('DEPOSIT', 'WITHDRAWAL') NOT NULL,
            status enum ('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
            description varchar(255) NULL,
            reference varchar(255) NULL,
            userId varchar(36) NOT NULL,
            walletId varchar(36) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted_at timestamp NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE
        )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
