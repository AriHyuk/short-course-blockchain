import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Import 2 jagoan kita tadi
import { BlockchainController } from './blockchain/blockchain.controller';
import { BlockchainService } from './blockchain/blockchain.service';

@Module({
  imports: [],
  // Daftarkan di sini 👇
  controllers: [AppController, BlockchainController],
  providers: [AppService, BlockchainService],
})
export class AppModule {}