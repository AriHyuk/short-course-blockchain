import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Sedang deploy ke Avalanche Fuji...");

  // Ambil kontrak kita
  const simpleStorage = await ethers.deployContract("SimpleStorage");

  // Tunggu sampai masuk blockchain
  await simpleStorage.waitForDeployment();

  console.log(`✅ SUKSES! Contract Address: ${simpleStorage.target}`);
  console.log("👉 Simpan address ini buat besok!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});