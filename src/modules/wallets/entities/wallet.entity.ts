import { Currency, User } from 'src/common/database/entities';
import { BaseEntity } from 'src/common/database/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

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

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
