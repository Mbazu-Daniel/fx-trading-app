import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CurrencyRepository } from '../currency/currency.repository';
import { UsersService } from '../users/users.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { WalletRepository } from './wallet.repository';

@Injectable()
export class WalletsService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly usersService: UsersService,
    private readonly currencyRepository: CurrencyRepository,
  ) {}

  async findAll(): Promise<Wallet[]> {
    return this.walletRepository.findAll();
  }

  async getWalletById(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findById(id);
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }
    return wallet;
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    // Verify user exists
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.walletRepository.findUserWallets(userId);
  }

  async getOrCreateWallet(userId: string, currencyId: string): Promise<Wallet> {
    // Check if wallet already exists
    let wallet = await this.walletRepository.findByUserAndCurrency(
      userId,
      currencyId,
    );

    if (!wallet) {
      // Verify user exists
      await this.usersService.getUserById(userId);

      // Verify currency exists and is active
      const currency = await this.currencyRepository.findById(currencyId);
      if (!currency) {
        throw new NotFoundException(`Currency with ID ${currencyId} not found`);
      }

      if (!currency.isActive) {
        throw new BadRequestException(
          `Currency ${currency.code} is not active`,
        );
      }

      // Create new wallet
      wallet = await this.walletRepository.create({
        userId,
        currencyId,
        balance: 0,
      });
    }

    return wallet;
  }

  async create(
    userId: string,
    createWalletDto: CreateWalletDto,
  ): Promise<Wallet> {
    // Verify user exists
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verify currency exists and is active
    const currency = await this.currencyRepository.findById(
      createWalletDto.currencyId,
    );
    if (!currency) {
      throw new NotFoundException(
        `Currency with ID ${createWalletDto.currencyId} not found`,
      );
    }

    if (!currency.isActive) {
      throw new BadRequestException(`Currency ${currency.code} is not active`);
    }

    // Check if wallet already exists
    const existingWallet = await this.walletRepository.findByUserAndCurrency(
      userId,
      createWalletDto.currencyId,
    );

    if (existingWallet) {
      throw new BadRequestException(
        `User already has a wallet for this currency`,
      );
    }

    return this.walletRepository.create({ ...createWalletDto, userId });
  }

  async update(id: string, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    await this.getWalletById(id);
    return this.walletRepository.update(id, updateWalletDto);
  }

  async updateBalance(id: string, amount: number): Promise<Wallet> {
    const wallet = await this.getWalletById(id);

    const newBalance = Number(wallet.balance) + amount;

    if (newBalance < 0) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    return this.walletRepository.update(id, { balance: newBalance });
  }

  async delete(id: string): Promise<void> {
    await this.walletRepository.delete(id);
  }
}
