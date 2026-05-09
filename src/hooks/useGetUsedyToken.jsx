import { useCallback, useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import useProgram from "./useProgram";
import { getPlatformConfigPDA } from "../utils/pdas";

const useGetUsedyToken = () => {
  const { connection } = useAppKitConnection();
  const { address: _address } = useAppKitAccount();
  const publicKey = _address ? new PublicKey(_address) : null;
  const program = useProgram(false);

  const [userBal, setUserBal] = useState(new BN(0));
  const [balanceUI, setBalanceUI] = useState(0);
  const [decimals, setDecimals] = useState(0);

  const refreshBalance = useCallback(async () => {
    if (!publicKey || !program) {
      setUserBal(new BN(0));
      setBalanceUI(0);
      return;
    }

    try {
      const [platformConfigPDA] = getPlatformConfigPDA();
      const platformConfig = await program.account.platformConfig.fetch(
        platformConfigPDA
      );
      const usedyMint = platformConfig.usedyMint; // PublicKey

      const ata = await getAssociatedTokenAddress(usedyMint, publicKey);

     
      try {
        const tokenAccount = await getAccount(connection, ata);
        const rawAmount = new BN(tokenAccount.amount.toString());

        // Fetch mint info to get decimals (once)
        if (decimals === 0) {
          const mintInfo = await connection.getParsedAccountInfo(usedyMint);
          const mintDecimals =
            mintInfo?.value?.data?.parsed?.info?.decimals ?? 0;
          setDecimals(mintDecimals);
          setBalanceUI(
            rawAmount.toNumber() / Math.pow(10, mintDecimals)
          );
        } else {
          setBalanceUI(rawAmount.toNumber() / Math.pow(10, decimals));
        }

        setUserBal(rawAmount);
      } catch {
        // Token account doesn't exist yet — balance is 0
        setUserBal(new BN(0));
        setBalanceUI(0);
      }
    } catch (err) {
      console.error("Error fetching USEDY balance:", err);
      setUserBal(new BN(0));
      setBalanceUI(0);
    }
  }, [connection, publicKey, program, decimals]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return {
    userBal,       // BN — raw amount
    balanceUI,     // number — human-readable
    refreshBalance,
    refetch: refreshBalance,
  };
};

export default useGetUsedyToken;