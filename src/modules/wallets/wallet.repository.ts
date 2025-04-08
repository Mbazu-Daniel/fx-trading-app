import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletRepository extends BaseRepository<Wallet> {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {
    super(walletRepository);
  }

  async findByUserAndCurrency(
    userId: string,
    currencyId: string,
  ): Promise<Wallet | undefined> {
    return this.walletRepository.findOne({
      where: { userId, currencyId },
      relations: ['currency'],
    });
  }

  async findUserWallets(userId: string): Promise<Wallet[]> {
    return this.walletRepository.find({
      where: { userId },
      relations: ['currency'],
    });
  }
}
