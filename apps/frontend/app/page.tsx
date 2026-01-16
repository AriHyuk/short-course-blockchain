"use client";

import { useState, useEffect } from "react";
// Import Reown & Wagmi (Masih dipakai buat Write/Transaksi)
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import SimpleStorageABI from "@/utils/SimpleStorage.json";

export default function Home() {
  // --- SETUP ---
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [numberInput, setNumberInput] = useState("");
  
  // STATE BARU: Buat nyimpen data dari Backend
  const [backendData, setBackendData] = useState({ value: "0", source: "Loading..." });
  const [historyData, setHistoryData] = useState([]);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  // Ambil Config dari .env
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  // --- FUNGSI 1: FETCH DATA DARI BACKEND API (Task 1) ---
  const fetchDataFromBackend = async () => {
    try {
      setIsLoadingAPI(true);
      
      // 1. Ambil Value Terkini
      const resValue = await fetch(`${BACKEND_URL}/blockchain/value`);
      const jsonValue = await resValue.json();
      setBackendData(jsonValue);

      // 2. Ambil History
      const resHistory = await fetch(`${BACKEND_URL}/blockchain/history`);
      const jsonHistory = await resHistory.json();
      // Cek kalau array, simpan. Kalau error, kosongin.
      if (Array.isArray(jsonHistory)) {
        setHistoryData(jsonHistory);
      }
      
    } catch (error) {
      console.error("Gagal ambil data backend:", error);
      setBackendData({ value: "Error", source: "Backend Mati" });
    } finally {
      setIsLoadingAPI(false);
    }
  };

  // Panggil data pas pertama kali buka web
  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  // --- FUNGSI 2: WRITE CONTRACT (Task 2 - Tetap via Wallet) ---
  const { data: hash, writeContract, isPending: isConfirming } = useWriteContract();
  
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Kalau transaksi sukses, otomatis refresh data dari Backend
  useEffect(() => {
    if (isTxSuccess) {
      setTimeout(() => {
        fetchDataFromBackend(); // <-- Update UI pake data baru
        setNumberInput("");
      }, 3000); // Kasih jeda dikit biar blockchain update
    }
  }, [isTxSuccess]);

  const handleSetValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numberInput) return;

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: SimpleStorageABI.abi,
      functionName: "setValue",
      args: [BigInt(numberInput)],
    });
  };

  // Identitas
  const NAMA = "Ari Awaludin";
  const NIM = "221011402404";

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-black text-white font-mono">
      <div className="z-10 w-full max-w-2xl flex flex-col gap-6 mt-10">
        
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Avalanche Day 5
        </h1>
        <p className="text-center text-gray-400 text-sm">Full Stack Integration (Frontend ↔ Backend ↔ Chain)</p>

        {/* SECTION 1: WALLET */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center">
          {!isConnected ? (
            <button onClick={() => open()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all">
              Connect Wallet
            </button>
          ) : (
            <div>
              <p className="text-green-400 font-bold mb-2">✅ Wallet Connected</p>
              <p className="text-xs text-gray-500 break-all">{address}</p>
            </div>
          )}
        </div>

        {/* SECTION 2: READ DATA (DARI BACKEND) */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-600 text-xs px-2 py-1 font-bold">READ via API</div>
          
          <p className="text-gray-400 text-xs uppercase mb-2">Current Value (fetched from NestJS)</p>
          <div className="flex justify-between items-end">
             <h2 className="text-5xl font-bold text-white">{backendData.value}</h2>
             <button onClick={fetchDataFromBackend} className="text-xs text-blue-400 underline hover:text-blue-300">
               {isLoadingAPI ? "Refreshing..." : "Refresh Data"}
             </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-2">Source: {backendData.source || "Unknown"}</p>
        </div>

        {/* SECTION 3: WRITE DATA (VIA WALLET) */}
        {isConnected && (
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-xs px-2 py-1 font-bold">WRITE via Wallet</div>
            
            <form onSubmit={handleSetValue} className="flex gap-2 mt-4">
              <input
                type="number"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder="Set new value..."
                className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:border-red-500 outline-none"
                disabled={isConfirming || isTxLoading}
              />
              <button
                type="submit"
                disabled={!numberInput || isConfirming || isTxLoading}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-bold disabled:opacity-50"
              >
                {isConfirming || isTxLoading ? "⏳" : "Save"}
              </button>
            </form>
            {isTxSuccess && <p className="text-green-400 text-xs mt-2 text-center">Update Berhasil! Data akan refresh otomatis.</p>}
          </div>
        )}

        {/* SECTION 4: HISTORY (BONUS TASK) */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
           <h3 className="text-lg font-bold mb-4 text-purple-400">📜 Transaction History</h3>
           <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {historyData.length === 0 ? (
                <p className="text-xs text-gray-500 text-center">Belum ada history baru di 2000 blok terakhir.</p>
              ) : (
                historyData.map((item: any, idx) => (
                  <div key={idx} className="bg-black/50 p-2 rounded border-l-2 border-purple-500 text-xs flex justify-between">
                    <span>Block #{item.blockNumber}</span>
                    <span className="font-bold text-yellow-400">Value: {item.newValue}</span>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* FOOTER */}
        <div className="text-center opacity-40 text-xs mt-4">
          <p className="font-bold">{NAMA}</p>
          <p>{NIM}</p>
        </div>

      </div>
    </main>
  );
}