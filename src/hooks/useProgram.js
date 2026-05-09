/**
 * useProgram.js  (Reown AppKit Solana version)
 * Replaces: useContractInstance.js
 */

import { useMemo } from "react";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey, Connection } from "@solana/web3.js";
import idl from "../idl/umarket.json";


export const PROGRAM_ID = new PublicKey(
  import.meta.env.VITE_PROGRAM_ID 
);


const CUSTOM_RPC = import.meta.env.VITE_SOLANA_RPC_URL;
const customConnection = CUSTOM_RPC
  ? new Connection(CUSTOM_RPC, "confirmed")
  : null;

/**
 * @param {boolean} withSigner - true for write txns, false for reads
 * @returns {import("@coral-xyz/anchor").Program | null}
 */
const useProgram = (withSigner = false) => {
  const { connection: appKitConnection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider("solana");
  const { isConnected } = useAppKitAccount();

  return useMemo(() => {
    const connection = customConnection ?? appKitConnection;
    if (!connection) return null;

    if (withSigner) {
      if (!isConnected || !walletProvider) return null;

      const provider = new AnchorProvider(connection, walletProvider, {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      });
      return new Program(idl, provider);
    }

    const readOnlyWallet = {
      publicKey: null,
      signTransaction: async (tx) => tx,
      signAllTransactions: async (txs) => txs,
    };

    const provider = new AnchorProvider(connection, readOnlyWallet, {
      commitment: "confirmed",
    });
    return new Program(idl, provider);
  }, [appKitConnection, walletProvider, isConnected, withSigner]);
};

export default useProgram;