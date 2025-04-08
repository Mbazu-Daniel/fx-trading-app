import { Trade, Transaction, Wallet } from 'src/common/database/entities';
import { BaseEntity } from 'src/common/database/entities/base.entity';
import { UserRole } from 'src/common/enums';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: UserRole, default: UserRole.BASIC })
  role: string;

  @Column({ name: 'verified_at', nullable: true })
  verifiedAt: Date;

  @Column({ name: 'otp_code', nullable: true })
  otpCode: string;

  @Column({ name: 'otp_expires_at', nullable: true })
  otpExpiresAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.currency)
  wallets: Wallet[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Trade, (trade) => trade.user)
  trades: Trade[];
}
