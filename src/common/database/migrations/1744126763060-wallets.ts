import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wallets1744126763060 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS wallets (
        id CHAR(36) NOT NULL,
        balance DECIMAL(18, 8) NOT NULL DEFAULT 0,
        user_id CHAR(36) NOT NULL,
        currency_id CHAR(36) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT FK_wallet_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT FK_wallet_currency FOREIGN KEY (currency_id) REFERENCES currencies(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('wallets');
  }
}
