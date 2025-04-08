import { Trade, Wallet } from 'src/common/database/entities';
import { BaseEntity } from 'src/common/database/entities/base.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity('currencies')
export class Currency extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.currency)
  wallets: Wallet[];

  @OneToMany(() => Trade, (trade) => trade.fromCurrency)
  tradesFrom: Trade[];

  @OneToMany(() => Trade, (trade) => trade.toCurrency)
  tradesTo: Trade[];
}
