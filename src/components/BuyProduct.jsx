import { useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { toast } from "react-toastify";
import useProgram from "../hooks/useProgram";
import {
  getPlatformConfigPDA,
  getProfilePDA,
  getProductPDA,
  getEscrowPDA,
  getEscrowVaultPDA,
} from "../utils/pdas";
import { getErrorMessage } from "../utils/parseAnchorError";
import { formatPrice, calculateTotal, formatSol, formatSpl } from "../utils/priceUtils";
import { useProduct } from "../context/ContextProvider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "white",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: 10,
  boxShadow: 24,
  maxHeight: "90vh",
  overflowY: "auto",
  border: "1px solid #42714262",
  backgroundColor: "#1E1D34",
  p: 4,
};

const BuyProduct = ({ id, price, paymentMode = { sol: {} }, tiers = [] }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { address: _address, isConnected } = useAppKitAccount();
  const program = useProgram(true);
  const { refreshBalance } = useProduct();

  const publicKey = _address ? new PublicKey(_address) : null;
  const isSpl = paymentMode && "spl" in paymentMode;
  const { symbol } = formatPrice(price, paymentMode);

 
  const { totalBN, totalDisplay } = useMemo(() => {
    const qty = Math.floor(Number(amount));
    if (!qty || qty <= 0 || !price) return { totalBN: new BN(0), totalDisplay: "0" };
    const bn = calculateTotal(price, qty, tiers);
    const display = isSpl ? formatSpl(bn) : formatSol(bn);
    return { totalBN: bn, totalDisplay: display };
  }, [amount, price, tiers, isSpl]);

  const priceDisplay = useMemo(
    () => (isSpl ? formatSpl(price) : formatSol(price)),
    [price, isSpl]
  );

  
  const handleBuyProduct = useCallback(async () => {
    const qty = Math.floor(Number(amount));
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (!isConnected || !publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!program) {
      toast.error("Program not initialised — check your wallet connection");
      return;
    }

    setIsSubmitting(true);
    try {
      const bnProductId = new BN(id);
      const bnAmountKg = new BN(qty);

      const [platformConfigPDA] = getPlatformConfigPDA();
      const [buyerProfilePDA] = getProfilePDA(publicKey);
      const [productPDA] = getProductPDA(bnProductId);
      const [escrowPDA] = getEscrowPDA(bnProductId, publicKey);

      let txSig;

      if (!isSpl) {
        
        txSig = await program.methods
          .buyProductSol(bnAmountKg)
          .accounts({
            platformConfig: platformConfigPDA,
            buyerProfile: buyerProfilePDA,
            product: productPDA,
            escrow: escrowPDA,
            buyer: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      } else {
       
        const [escrowVaultPDA] = getEscrowVaultPDA(bnProductId, publicKey);

        txSig = await program.methods
          .buyProductSpl(bnAmountKg)
          .accounts({
            platformConfig: platformConfigPDA,
            buyerProfile: buyerProfilePDA,
            product: productPDA,
            escrow: escrowPDA,
            escrowVault: escrowVaultPDA,
            buyer: publicKey,
           
          })
          .rpc();
      }

      toast.success(`Purchase successful! Tx: ${txSig.slice(0, 8)}…`, {
        position: "top-center",
      });
      refreshBalance?.();
      setAmount("");
      setOpen(false);
    } catch (err) {
      const reason = getErrorMessage(err);
      toast.error(`Purchase failed — ${reason}`, { position: "top-center" });
      console.error("buyProduct error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [amount, id, isConnected, publicKey, program, isSpl, refreshBalance]);

  return (
    <div>
      <button
        className="bg-white text-[#0C3B45] border border-[#0C3B45] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-full my-2 hover:bg-bg-ash hover:text-darkGrey"
        onClick={() => setOpen(true)}
      >
        Buy Product
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <h2 className="text-white text-xl font-bold mb-4">Purchase Product</h2>

          {/* Price per unit */}
          <div className="mb-4">
            <label className="text-white text-sm mb-2 block">Price per kg:</label>
            <div className="text-white bg-[#2E343A] rounded-lg p-4 border border-white/50">
              {priceDisplay} {symbol}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="text-white text-sm mb-2 block">
              Quantity (kg):
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              placeholder="How many kg?"
              onChange={(e) => setAmount(e.target.value)}
              className="text-white rounded-lg w-full p-4 bg-[#2E343A] border border-white/50 backdrop-blur-lg outline-none"
            />
          </div>

          {/* Tier discount hint */}
          {tiers.length > 0 && (
            <div className="mb-4 text-sm text-white/60 bg-white/5 rounded-lg p-3">
              {tiers.map((t, i) => (
                <p key={i}>
                  ≥ {t.quantity} kg → {t.discountPercentage}% discount
                </p>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="mb-4 p-4 bg-[#073F77] rounded-lg border-2 border-[#0C3B45]">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">Total:</span>
              <span className="text-white font-bold text-lg">
                {totalDisplay} {symbol}
              </span>
            </div>
            {Number(amount) > 0 && (
              <div className="text-sm text-gray-300 mt-2">
                {amount} kg × {priceDisplay} {symbol} = {totalDisplay} {symbol}
              </div>
            )}
          </div>

          <button
            className="bg-[#2E343A] text-white py-2 px-4 rounded-lg lg:text-[20px] font-bold text-[16px] w-full my-4 hover:bg-[#073F77] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBuyProduct}
            disabled={!amount || Number(amount) <= 0 || isSubmitting}
          >
            {isSubmitting ? "Processing…" : `Buy Product →`}
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default BuyProduct;