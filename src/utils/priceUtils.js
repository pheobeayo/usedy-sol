
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

const toBN = (val) =>
  val instanceof BN ? val : new BN(val?.toString() ?? "0");

export const formatSol = (lamports, decimals = 4) => {
  try {
    const n = toBN(lamports).toNumber();
    return (n / LAMPORTS_PER_SOL).toFixed(decimals).replace(/\.?0+$/, "");
  } catch {
    return "0";
  }
};

export const formatSpl = (amount, decimals = 6) => {
  try {
    const n = toBN(amount).toNumber();
    return (n / Math.pow(10, decimals)).toFixed(2).replace(/\.?0+$/, "");
  } catch {
    return "0";
  }
};

export const formatPrice = (price, paymentMode) => {
  const isSpl = paymentMode && "spl" in paymentMode;
  return isSpl
    ? { formatted: formatSpl(price), symbol: "USDC" }
    : { formatted: formatSol(price), symbol: "SOL" };
};

export const calculateTotal = (pricePerKg, quantityKg, tiers = []) => {
  const base = toBN(pricePerKg).muln(quantityKg);
  let bestDiscount = 0;
  for (const tier of tiers) {
    if (quantityKg >= tier.quantity && tier.discountPercentage > bestDiscount) {
      bestDiscount = tier.discountPercentage;
    }
  }
  if (bestDiscount === 0) return base;
  // Apply discount: base - (base * discount / 100)
  const discount = base.muln(bestDiscount).divn(100);
  return base.sub(discount);
};