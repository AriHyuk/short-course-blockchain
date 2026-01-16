import { Injectable } from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';
import * as SimpleStorageABI from '../abi/SimpleStorage.json'; 

@Injectable()
export class BlockchainService {
  private publicClient = createPublicClient({
    chain: avalancheFuji,
    transport: http(),
  });

  // Pastikan Address ini BENAR sesuai kontrak kamu
  private contractAddress = '0xF2f04E6845d8EA909a4D82001240b59aeD8Dc6f8';

  async getValue() {
    try {
      const data = await this.publicClient.readContract({
        address: this.contractAddress as `0x${string}`,
        abi: SimpleStorageABI.abi,
        functionName: 'getValue',
      });
      
      return { 
        // 👇 PERBAIKAN DI SINI (Kita casting jadi bigint dulu)
        value: (data as bigint).toString(),
        source: 'Via NestJS Backend 🚀' 
      }; 
    } catch (error) {
      console.error(error);
      return { error: 'Gagal baca contract', details: error.message };
    }
  }

  getContractInfo() {
    return {
      address: this.contractAddress,
      network: 'Avalanche Fuji Testnet',
    };
  }
async getHistory() {
    try {
      // 1. Cek dulu sekarang blok nomor berapa
      const currentBlock = await this.publicClient.getBlockNumber();

      // 2. Ambil log HANYA dari 2000 blok terakhir (Biar gak kena limit 2048)
      const logs = await this.publicClient.getContractEvents({
        address: this.contractAddress as `0x${string}`,
        abi: SimpleStorageABI.abi,
        eventName: 'ValueUpdated',
        // Ambil dari (Blok Sekarang - 2000) sampai (Blok Terbaru)
        fromBlock: currentBlock - 2000n, 
        toBlock: 'latest' 
      });

      const history = logs.map((log) => ({
        blockNumber: log.blockNumber.toString(),
        // @ts-ignore
        newValue: log.args.newValue.toString(),
        // @ts-ignore
        changer: log.args.changer,
        transactionHash: log.transactionHash
      }));

      return history;
    } catch (error) {
      console.error('Error detail:', error); // Biar gampang debug di terminal
      return { 
        error: 'Gagal ambil history', 
        reason: 'RPC Limit Reached',
        details: error.message 
      };
    }
  }
}