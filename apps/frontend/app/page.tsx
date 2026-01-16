"use client";

import { useState, useEffect } from "react";
// Import library Web3
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
// Import ABI (Kamus Kontrak)
import SimpleStorageABI from "@/utils/SimpleStorage.json";

// 🔹 CONFIGURATION
// Masukkan Contract Address yang kamu deploy di Day 2
const CONTRACT_ADDRESS = "0xF2f04E6845d8EA909a4D82001240b59aeD8Dc6f8"; 

export default function Home() {
  // 1. Setup Wallet & Modal
  const { open } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount();

  // 2. Setup State untuk Input User
  const [numberInput, setNumberInput] = useState("");

  // 3. READ CONTRACT (Membaca data 'getValue' dari blockchain)
  const { 
    data: retrievedValue, 
    refetch,
    isLoading: isReading 
  } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SimpleStorageABI.abi,
    functionName: "getValue",
  });

  // 4. WRITE CONTRACT (Mengubah data 'setValue')
  const { 
    data: hash, 
    writeContract, 
    isPending: isConfirming 
  } = useWriteContract();

  // 5. Pantau Status Transaksi (Tunggu sampai sukses)
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Efek: Kalau transaksi sukses, otomatis baca ulang datanya
  useEffect(() => {
    if (isTxSuccess) {
      refetch();
      setNumberInput(""); // Reset input
    }
  }, [isTxSuccess, refetch]);

  // --- HANDLER FUNCTIONS ---
  
  const handleConnect = () => {
    open(); // Buka modal Reown
  };

  const handleSetValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numberInput) return;

    // Kirim transaksi ke blockchain
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: SimpleStorageABI.abi,
      functionName: "setValue",
      args: [BigInt(numberInput)], // Konversi ke tipe BigInt (uint256)
    });
  };

  // Identitas Peserta
  const NAMA = "Ari Awaludin";
  const NIM = "221011402404";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-black text-white font-mono">
      <div className="z-10 w-full max-w-xl flex flex-col gap-6">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            Avalanche Day 3
          </h1>
          <p className="text-gray-400">Frontend Integration (Reown + Wagmi)</p>
        </div>

        {/* CONTAINER UTAMA */}
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl">
          
          {/* SECTION 1: WALLET CONNECTION */}
          <div className="mb-8 text-center">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              >
                📡 Connect Wallet
              </button>
            ) : (
              <div className="space-y-3">
                 <div className="inline-block px-4 py-1 bg-green-900/30 border border-green-500/50 rounded-full text-green-400 text-sm font-bold">
                    ✅ Connected
                 </div>
                 <div className="bg-black/40 p-3 rounded-lg border border-gray-700">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Your Address</p>
                    <p className="font-mono text-sm break-all text-white">{address}</p>
                 </div>
                 <button 
                    onClick={() => open()} 
                    className="text-xs text-red-400 hover:text-red-300 underline"
                 >
                    Disconnect / Switch Wallet
                 </button>
              </div>
            )}
          </div>

          {/* SECTION 2: INTERAKSI SMART CONTRACT */}
          {isConnected && (
            <div className="space-y-6 border-t border-gray-800 pt-6">
              
              {/* READ (GET VALUE) */}
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Current Value (On-Chain)</p>
                  <p className="text-xs text-gray-500">Read from contract</p>
                </div>
                <div className="text-right">
                  {isReading ? (
                    <span className="animate-pulse text-yellow-500">Loading...</span>
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {retrievedValue?.toString() || "0"}
                    </span>
                  )}
                </div>
              </div>

              {/* WRITE (SET VALUE) */}
              <form onSubmit={handleSetValue} className="space-y-3">
                <label className="text-xs text-gray-400 uppercase font-bold">Set New Value</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={numberInput}
                    onChange={(e) => setNumberInput(e.target.value)}
                    placeholder="Enter number..."
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 text-white transition-colors"
                    disabled={isConfirming || isTxLoading}
                  />
                  <button
                    type="submit"
                    disabled={!numberInput || isConfirming || isTxLoading}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      !numberInput || isConfirming || isTxLoading
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                    }`}
                  >
                    {isConfirming || isTxLoading ? "⏳..." : "Save"}
                  </button>
                </div>
                
                {/* STATUS TRANSAKSI */}
                {hash && (
                  <div className="mt-2 text-xs text-center p-2 bg-blue-900/20 border border-blue-800 rounded">
                    <p className="text-blue-400">Transaction Hash:</p>
                    <a 
                      href={`https://testnet.snowtrace.io/tx/${hash}`} 
                      target="_blank" 
                      className="text-blue-300 underline break-all hover:text-white"
                    >
                      {hash}
                    </a>
                  </div>
                )}
                {isTxSuccess && (
                  <p className="text-xs text-center text-green-400 font-bold animate-bounce mt-2">
                    🎉 Value Updated Successfully!
                  </p>
                )}
              </form>

            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="text-center opacity-50 text-xs mt-4">
          <p className="font-bold">{NAMA}</p>
          <p>{NIM}</p>
        </div>

      </div>
    </main>
  );
}