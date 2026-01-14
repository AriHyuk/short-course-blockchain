"use client";
import { useState } from "react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("");
  const [chainId, setChainId] = useState("");
  const [balance, setBalance] = useState(""); // <-- 1. Tambah State Saldo

  // --- BAGIAN TUGAS 3: GANTI NIM KAMU DI SINI ---
  const NAMA = "Ari Awaludin";
  const NIM = "221011402404"; 

const connectWallet = async () => {
    // @ts-ignore
    if (typeof window.ethereum !== "undefined") {
      try {
        setStatus("Connecting...");
        
        // Cek provider spesifik Avalanche (biar gak bentrok sama MetaMask)
        // @ts-ignore
        const provider = window.avalanche || window.ethereum;

        // 1. Request Akun
        // @ts-ignore
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
        setWalletAddress(account);

        // 2. Cek Network
        // @ts-ignore
        const chainIdHex = await provider.request({ method: "eth_chainId" });
        setChainId(chainIdHex);

        // 3. Ambil Saldo
        // @ts-ignore
        const balanceHex = await provider.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });
        
        const balanceValue = parseInt(balanceHex, 16) / 1e18;
        setBalance(balanceValue.toFixed(4));

        if (chainIdHex === "0xa869") {
          setStatus("✅ Connected to Avalanche Fuji");
        } else {
          setStatus("❌ Wrong Network! Switch to Fuji.");
        }

      } catch (error: any) {
        console.error(error);
        // INI PENTING: Munculkan error di layar biar kita tau kenapa
        alert("GAGAL CONNECT: " + (error.message || error));
        setStatus("❌ Error: " + (error.message || "Unknown error"));
      }
    } else {
      alert("Core Wallet gak ketemu! Coba refresh atau install ulang extension.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col gap-8">
        
        <h1 className="text-4xl font-bold text-red-500">Avalanche Day 1</h1>
        
        <div className="border border-gray-700 p-8 rounded-xl bg-gray-900 w-full max-w-md text-center">
          
          {/* Status Network */}
          <p className="mb-4 text-lg font-bold">{status || "Not Connected"}</p>

          {/* Tombol Connect */}
          {!walletAddress && (
            <button
              onClick={connectWallet}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Connect Core Wallet 🔺
            </button>
          )}

          {/* Tampilan Data (Task 3) */}
          {walletAddress && (
            <div className="text-left space-y-3 mt-4">
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-400 text-xs">Address:</p>
                <p className="text-green-400 break-all">{walletAddress}</p>
              </div>
              
              <div className="bg-gray-800 p-3 rounded">
                 <p className="text-gray-400 text-xs">Chain ID:</p>
                 <p>{chainId}</p>
              </div>

              {/* TAMPILAN SALDO BARU */}
              <div className="bg-gray-800 p-3 rounded border border-yellow-600">
                 <p className="text-gray-400 text-xs">Balance:</p>
                 <p className="text-yellow-400 font-bold">{balance} AVAX</p>
              </div>

              {/* WAJIB: Identitas Peserta */}
              <div className="border border-red-500 p-3 rounded mt-4">
                <p className="text-red-500 text-xs font-bold uppercase">Peserta:</p>
                <p className="text-xl font-bold">{NAMA}</p>
                <p>{NIM}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}