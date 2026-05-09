import { PublicKey } from "@solana/web3.js";
import { useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { BN } from "@coral-xyz/anchor";
import { toast } from "react-toastify";
import useProgram from "./useProgram";
import { getProfilePDA, getProductPDA } from "../utils/pdas";
import { getErrorMessage } from "../utils/parseAnchorError";
import { useProduct } from "../context/ContextProvider";

const useEditProduct = () => {
  const program = useProgram(true);
  const { address: _address, isConnected } = useAppKitAccount();
  const publicKey = _address ? new PublicKey(_address) : null;
  const { refreshProducts } = useProduct();

  return useCallback(
    async (
      productId,
      productName,
      imageUrl,
      productDesc,
      price,            // BN — per kg in lamports / SPL base units
      weight,           // BN or number — total kg
      paymentMode = { sol: {} },
      negotiationTiers = []
    ) => {
      
      if (!productName || !imageUrl || !productDesc || !price || !weight) {
        toast.error("All product fields are required");
        return;
      }

      if (!publicKey) {
        toast.error("Please connect your wallet");
        return;
      }

      if (!program) {
        toast.error("Program not initialised — check your wallet connection");
        return;
      }

      const bnProductId = new BN(productId);
      const bnWeight = new BN(weight);
      const bnPrice = price instanceof BN ? price : new BN(price.toString());
      const tiers = negotiationTiers.map((t) => ({
        quantity: new BN(t.quantity),
        discountPercentage: t.discountPercentage,
      }));

     
      const [profilePDA] = getProfilePDA(publicKey);
      const [productPDA] = getProductPDA(bnProductId);

    
      try {
        const txSig = await program.methods
          .updateProduct(
            productName,
            imageUrl,
            productDesc,
            bnPrice,
            bnWeight,
            paymentMode,
            tiers
          )
          .accounts({
            sellerProfile: profilePDA,
            product: productPDA,
            seller: publicKey,
          })
          .rpc();

        toast.success(`Product updated! Tx: ${txSig.slice(0, 8)}…`);
        refreshProducts?.();
        return txSig;
      } catch (err) {
        const reason = getErrorMessage(err);
        toast.error(`Failed to update product — ${reason}`, {
          position: "top-center",
        });
        console.error("updateProduct error:", err);
      }
    },
    [program, publicKey, refreshProducts]
  );
};

export default useEditProduct;