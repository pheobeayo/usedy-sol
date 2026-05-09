import { useState, useEffect, useCallback, useRef } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import useProgram from "./useProgram";
 
export const useGetApprovedPayments = () => {
  const [approvedPayments, setApprovedPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const program = useProgram(false);
  const { address: publicKey } = useAppKitAccount();
  const listenerIdRef = useRef(null);
 
 
  const fetchApprovedFromHistory = useCallback(async () => {
    if (!program || !publicKey) {
      setApprovedPayments([]);
      return;
    }
 
    setLoading(true);
    try {
      setApprovedPayments([]);
    } catch (err) {
      console.error("Error fetching approved payments:", err);
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);
 
  // Live event subscription 
  useEffect(() => {
    if (!program || !publicKey) return;
 
    const id = program.addEventListener(
      "PaymentApproved",
      (event) => {
        // event.buyer is a PublicKey
        if (event.buyer.toBase58() === publicKey) {
          const productId = event.productId.toNumber();
          setApprovedPayments((prev) =>
            prev.includes(productId) ? prev : [...prev, productId]
          );
        }
      }
    );
 
    listenerIdRef.current = id;
 
    return () => {
      if (listenerIdRef.current !== null) {
        program.removeEventListener(listenerIdRef.current).catch(() => {});
      }
    };
  }, [program, publicKey]);
 
  useEffect(() => {
    fetchApprovedFromHistory();
  }, [fetchApprovedFromHistory]);
 
  return {
    approvedPayments,
    loading,
    refetchApprovedPayments: fetchApprovedFromHistory,
  };
};
 
export default useGetApprovedPayments;