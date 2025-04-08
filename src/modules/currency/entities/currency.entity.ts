import { BaseEntity } from 'src/common/database/entities/base.entity';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('currencies')
export class Currency extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.currency)
  wallets: Wallet[];
}
