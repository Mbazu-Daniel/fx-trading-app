import { Currency, Transaction, User } from 'src/common/database/entities';
import { BaseEntity } from 'src/common/database/entities/base.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wallets')
export class Wallet extends BaseEntity {
  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  balance: number;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Currency, (currency) => currency.wallets)
  currency: Currency;

  @Column()
  currencyId: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];
}
