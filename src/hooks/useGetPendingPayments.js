import { useState, useEffect, useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import useProgram from "./useProgram";
 
const useGetPendingPayments = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const program = useProgram(false);
  const { address: publicKey } = useAppKitAccount();
 
  const fetchPendingPayments = useCallback(async () => {
    if (!program || !publicKey) {
      setPendingPayments([]);
      return;
    }
 
    setLoading(true);
    try {
     
      const escrows = await program.account.escrow.all([
        {
          memcmp: {
            offset: 8, 
            bytes: publicKey,
          },
        },
      ]);
 
      // Extract the productIds
      const productIds = escrows.map(({ account }) =>
        account.productId.toNumber()
      );
 
      setPendingPayments(productIds);
    } catch (err) {
      console.error("Error fetching pending payments:", err);
      setPendingPayments([]);
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);
 
  useEffect(() => {
    fetchPendingPayments();
  }, [fetchPendingPayments]);
 
  return {
    pendingPayments,
    loading,
    refetchPendingPayments: fetchPendingPayments,
  };
};
 
export default useGetPendingPayments