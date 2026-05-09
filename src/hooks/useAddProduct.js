import { PublicKey } from "@solana/web3.js";
import { useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { BN } from "@coral-xyz/anchor";
import { toast } from "react-toastify";
import useProgram from "./useProgram";
import { getProfilePDA, getProductPDA, getPlatformConfigPDA } from "../utils/pdas";
import { getErrorMessage } from "../utils/parseAnchorError";
import { useProduct } from "../context/ContextProvider";

const useAddProduct = () => {
  const program = useProgram(true);
  const { address: _address, isConnected } = useAppKitAccount();
  const publicKey = _address ? new PublicKey(_address) : null;
  const { refreshProducts, refreshBalance } = useProduct();

  const addProduct = useCallback(
    async (
      productName,
      imageUrl,
      productDesc,
      price,           // BN — lamports or SPL base units per kg
      weight,          // BN or number — total available kg
      paymentMode = { sol: {} },        // default to SOL
      negotiationTiers = []             // optional bulk-discount tiers
    ) => {
      // ── Input validation ──────────────────────────────────────────────────
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

      // ── Derive PDAs ───────────────────────────────────────────────────────
      // platformConfig holds the current productCount used as the new product's seed
      const [platformConfigPDA] = getPlatformConfigPDA();
      const platformConfig = await program.account.platformConfig.fetch(
        platformConfigPDA
      );
      const nextProductId = platformConfig.productCount; // u64 BN

      const [profilePDA] = getProfilePDA(publicKey);
      const [productPDA] = getProductPDA(nextProductId);

      // ── Send transaction ──────────────────────────────────────────────────
      try {
        const bnWeight = new BN(weight);
        const bnPrice = price instanceof BN ? price : new BN(price.toString());

        const tiers = negotiationTiers.map((t) => ({
          quantity: new BN(t.quantity),
          discountPercentage: t.discountPercentage,
        }));

        const txSig = await program.methods
          .listProduct(
            productName,
            imageUrl,
            productDesc,
            bnPrice,
            bnWeight,
            paymentMode,
            tiers
          )
          .accounts({
            platformConfig: platformConfigPDA,
            sellerProfile: profilePDA,
            product: productPDA,
            seller: publicKey,
            
          })
          .rpc();

        toast.success(
          `Product listed! 1 USEDY minted to you. Tx: ${txSig.slice(0, 8)}…`
        );
        refreshProducts();
        refreshBalance();
        return txSig;
      } catch (err) {
        const reason = getErrorMessage(err);
        toast.error(`Failed to list product — ${reason}`, {
          position: "top-center",
        });
        console.error("listProduct error:", err);
      }
    },
    [program, publicKey, refreshProducts, refreshBalance]
  );

  return addProduct;
};

export default useAddProduct;