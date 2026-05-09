import { PublicKey } from "@solana/web3.js";
import { useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { BN } from "@coral-xyz/anchor";
import { toast } from "react-toastify";
import useProgram from "./useProgram";
import {
  getPlatformConfigPDA,
  getProfilePDA,
  getProductPDA,
  getEscrowPDA,
  getEscrowVaultPDA,
} from "../utils/pdas";
import { getErrorMessage } from "../utils/parseAnchorError";
import { useProduct } from "../context/ContextProvider";

const useApprovePayment = () => {
  const program = useProgram(true);
  const { address: _address, isConnected } = useAppKitAccount();
  const publicKey = _address ? new PublicKey(_address) : null;
  const { refreshBalance } = useProduct();

  const approvePayment = useCallback(
    async (productId, mode = "sol") => {
     
      if (productId === undefined || productId === null) {
        toast.error("Invalid product ID");
        return false;
      }

      if (!publicKey) {
        toast.error("Please connect your wallet");
        return false;
      }

      if (!program) {
        toast.error("Program not initialised — check your wallet connection");
        return false;
      }

      const bnProductId = new BN(productId);

      // ── Derive PDAs ───────────────────────────────────────────────────────
      const [platformConfigPDA] = getPlatformConfigPDA();
      const [productPDA] = getProductPDA(bnProductId);
      const [escrowPDA] = getEscrowPDA(bnProductId, publicKey);

      // Fetch product to know the seller's pubkey (needed as account in the tx)
      const productAccount = await program.account.product.fetch(productPDA);
      const sellerPubkey = productAccount.owner;
      const [sellerProfilePDA] = getProfilePDA(sellerPubkey);
      const [buyerProfilePDA] = getProfilePDA(publicKey);

      try {
        let txSig;

        if (mode === "sol") {
        
          txSig = await program.methods
            .approvePaymentSol()
            .accounts({
              platformConfig: platformConfigPDA,
              sellerProfile: sellerProfilePDA,
              buyerProfile: buyerProfilePDA,
              product: productPDA,
              escrow: escrowPDA,
              buyer: publicKey,
              seller: sellerPubkey,
              // usedyMint, buyerUsedyAta, feeRecipient resolved from IDL
            })
            .rpc();
        } else {
         
          const [escrowVaultPDA] = getEscrowVaultPDA(bnProductId, publicKey);

          txSig = await program.methods
            .approvePaymentSpl()
            .accounts({
              platformConfig: platformConfigPDA,
              sellerProfile: sellerProfilePDA,
              buyerProfile: buyerProfilePDA,
              product: productPDA,
              escrow: escrowPDA,
              escrowVault: escrowVaultPDA,
              buyer: publicKey,
              seller: sellerPubkey,
              // splPaymentMint, sellerSplAta, feeRecipientSplAta, token program resolved from IDL
            })
            .rpc();
        }

        toast.success(
          `Payment approved! 1 USEDY minted to you. Tx: ${txSig.slice(0, 8)}…`
        );
        refreshBalance?.();
        return true;
      } catch (err) {
        const reason = getErrorMessage(err);
        toast.error(`Failed to approve payment — ${reason}`, {
          position: "top-center",
        });
        console.error("approvePayment error:", err);
        return false;
      }
    },
    [program, publicKey, refreshBalance]
  );

  return approvePayment;
};

export default useApprovePayment;