import { BaseEntity } from 'src/common/database/entities/base.entity';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
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

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.currency)
  wallets: Wallet[];
}
