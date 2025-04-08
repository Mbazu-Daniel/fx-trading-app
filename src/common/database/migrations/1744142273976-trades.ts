import { MigrationInterface, QueryRunner } from 'typeorm';

export class Trades1744142273976 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS trades (
        id CHAR(36) NOT NULL,
        fromAmount decimal(18,8) NOT NULL,
        toAmount decimal(18,8) NOT NULL,
        rate decimal(18,8) NOT NULL,
        status enum('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
        reference CHAR(36) NULL,
        userId CHAR(36) NOT NULL,
        fromCurrencyId CHAR(36) NOT NULL,
        toCurrencyId CHAR(36) NOT NULL,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedAt TIMESTAMP NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_user_trade FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_from_currency FOREIGN KEY (fromCurrencyId) REFERENCES currencies(id) ON DELETE CASCADE,
        CONSTRAINT fk_to_currency FOREIGN KEY (toCurrencyId) REFERENCES currencies(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('trades');
  }
}
