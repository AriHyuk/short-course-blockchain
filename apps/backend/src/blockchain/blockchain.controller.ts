import { Controller, Get } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('value')
  async getValue() {
    return this.blockchainService.getValue();
  }

  // 👇 TAMBAHAN DI SINI
  @Get('history')
  async getHistory() {
    return this.blockchainService.getHistory();
  }

  @Get('info')
  getInfo() {
    return this.blockchainService.getContractInfo();
  }
}
