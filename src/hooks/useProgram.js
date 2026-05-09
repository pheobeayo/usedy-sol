import { useMemo } from "react";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "../idl/umarket.json"; 

export const PROGRAM_ID = new PublicKey(
  "82wC4Yky79wYGoEhKfYcCCcZiTQaCBLxPqAU8tKKrDkF"
);

/**
 * @param {boolean} withSigner 
 * @returns {import("@coral-xyz/anchor").Program | null}
 */
const useProgram = (withSigner = false) => {
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider("solana");
  const { isConnected } = useAppKitAccount();

  return useMemo(() => {
    if (!connection) return null;

    if (withSigner) {
      if (!isConnected || !walletProvider) return null;

      // AppKit's walletProvider satisfies Anchor's wallet interface directly
      const provider = new AnchorProvider(connection, walletProvider, {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      });

      return new Program(idl, provider);
    }

    // Read-only: no wallet needed
    const readOnlyWallet = {
      publicKey: null,
      signTransaction: async (tx) => tx,
      signAllTransactions: async (txs) => txs,
    };

    const provider = new AnchorProvider(connection, readOnlyWallet, {
      commitment: "confirmed",
    });

    return new Program(idl, provider);
  }, [connection, walletProvider, isConnected, withSigner]);
};

export default useProgram;