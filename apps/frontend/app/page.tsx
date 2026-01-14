"use client";
import { useState } from "react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("");
  const [chainId, setChainId] = useState("");

  // --- BAGIAN TUGAS 3: GANTI NIM KAMU DI SINI ---
  const NAMA = "Ari Awaludin";
  const NIM = "221011402404"; 

  const connectWallet = async () => {
    // @ts-ignore
    if (typeof window.ethereum !== "undefined") {
      try {
        // Task 1: Request Account
        // @ts-ignore
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);

        // Task 2: Network Validation
        // @ts-ignore
        const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
        setChainId(chainIdHex);

        // 0xa869 adalah Chain ID untuk Avalanche Fuji (Lihat modul 2.2)
        if (chainIdHex === "0xa869") {
          setStatus("✅ Connected to Avalanche Fuji");
        } else {
          setStatus("❌ Wrong Network! Please switch to Fuji.");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install Core Wallet");
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