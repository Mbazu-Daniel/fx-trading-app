import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { IAuthenticatedUserRequest } from 'src/common/interfaces';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get()
  async getUserTransactions(@CurrentUser() req: IAuthenticatedUserRequest) {
    return this.transactionService.getUserTransactions(req.auth.principalId);
  }

  @Get(':transactionId')
  async getTransactionById(
    @CurrentUser() req: IAuthenticatedUserRequest,
    @Param('transactionId') transactionId: string,
  ) {
    const transaction =
      await this.transactionService.getTransactionById(transactionId);

    // Check if the transaction belongs to the requesting user
    if (transaction.userId !== req.auth.principalId) {
      throw new ForbiddenException(
        `You do not have permission to access this transaction`,
      );
    }

    return transaction;
  }
}
