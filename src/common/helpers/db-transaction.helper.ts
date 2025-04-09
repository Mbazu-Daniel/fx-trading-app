import { Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

export class DbTransactionHelper {
  private static dataSource: DataSource;
  private static readonly logger = new Logger(DbTransactionHelper.name);

  static initialize(dataSource: DataSource): void {
    if (!dataSource) {
      throw new Error(
        'Invalid DataSource: Cannot initialize with null or undefined',
      );
    }
    DbTransactionHelper.dataSource = dataSource;
    this.logger.log(
      'DbTransactionHelper: DataSource initialized successfully!',
    );
  }

  static async execute(
    action: (queryRunner: QueryRunner) => Promise<any>,
  ): Promise<any> {
    if (
      !DbTransactionHelper.dataSource ||
      !DbTransactionHelper.dataSource.isInitialized
    ) {
      this.logger.error('DbTransactionHelper: DataSource is not initialized!');
      throw new ReferenceError(
        'DataSource not set. Please call initialize method to set the data source!',
      );
    }

    const queryRunner: QueryRunner =
      DbTransactionHelper.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const result = await action(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
