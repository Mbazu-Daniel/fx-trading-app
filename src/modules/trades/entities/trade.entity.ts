import { Currency, User } from 'src/common/database/entities';
import { BaseEntity } from 'src/common/database/entities/base.entity';
import { TradeStatus } from 'src/common/enums';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity('trades')
export class Trade extends BaseEntity {
  @Column({ type: 'decimal', precision: 18, scale: 8 })
  fromAmount: number;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  toAmount: number;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  rate: number;

  @Column({
    type: 'enum',
    enum: TradeStatus,
    default: TradeStatus.PENDING,
  })
  status: TradeStatus;

  @Column({ nullable: true })
  reference: string;

  @ManyToOne(() => User, (user) => user.trades)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Currency, (currency) => currency.tradesFrom)
  fromCurrency: Currency;

  @Column()
  fromCurrencyId: string;

  @ManyToOne(() => Currency, (currency) => currency.tradesTo)
  toCurrency: Currency;

  @Column()
  toCurrencyId: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
