import { useState, useEffect, useCallback } from "react";
import { BN } from "@coral-xyz/anchor";
import useProgram from "./useProgram";
import { getProductPDA } from "../utils/pdas";

const useGetProductBuyers = (productId) => {
  const [buyersData, setBuyersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const program = useProgram(false);

  const fetchProductBuyers = useCallback(async () => {
    if (!program || productId === undefined || productId === null) {
      setBuyersData([]);
      return;
    }

    setLoading(true);
    try {
      const bnProductId = new BN(productId);

      const allEscrows = await program.account.escrow.all();

      const productEscrows = allEscrows
        .filter(
          ({ account }) =>
            account.productId.toString() === bnProductId.toString()
        )
        .map(({ publicKey, account }) => ({
          escrowPubkey: publicKey.toBase58(),
          address: account.buyer.toBase58(),          // buyer wallet
          amountBought: account.amountKg.toString(),  // kg
          amount: account.amount.toString(),           // locked payment (lamports)
          paymentMode: account.paymentMode,
        }));

      setBuyersData(productEscrows);
    } catch (err) {
      console.error("Error fetching product buyers:", err);
      setBuyersData([]);
    } finally {
      setLoading(false);
    }
  }, [program, productId]);

  useEffect(() => {
    fetchProductBuyers();
  }, [fetchProductBuyers]);

  return {
    buyersData,
    loading,
    refetchBuyers: fetchProductBuyers,
  };
};

export default useGetProductBuyers;