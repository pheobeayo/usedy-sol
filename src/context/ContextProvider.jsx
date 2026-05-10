import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import useProgram from "../hooks/useProgram";
import useProgramEvent from "../hooks/useProgramEvent";
import useGetUsedyToken from "../hooks/useGetUsedyToken";
import useGetPendingPayments from "../hooks/useGetPendingPayments";
import { useGetApprovedPayments } from "../hooks/useGetApprovedPayments";

const IPFS_GW = "https://ipfs.io/ipfs/";
const convertIpfsUrl = (url) =>
  url?.startsWith("ipfs://") ? url.replace("ipfs://", IPFS_GW) : url ?? "";

const ProductContext = createContext();

export const ContextProvider = ({ children }) => {
  const readProgram = useProgram(false);
  const writeProgram = useProgram(true);

  const { isConnected, address } = useAppKitAccount();
  const { userBal, refreshBalance } = useGetUsedyToken();
  const { refetchPendingPayments } = useGetPendingPayments();
  const { refetchApprovedPayments } = useGetApprovedPayments();

  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [purchaseId, setPurchaseId] = useState([]);

  const refreshProducts = useCallback(async () => {
    if (!readProgram) return;
    try {
      const raw = await readProgram.account.product.all();
      const formatted = raw
        .map(({ publicKey, account }) => {
          const isSpl = account.paymentMode && "Spl" in account.paymentMode;
          return {
            id: account.productId.toNumber(),
            publicKey: publicKey.toBase58(),
            address: account.owner.toBase58(),
            name: account.name,
            image: convertIpfsUrl(account.image),
            location: account.location,
            product: account.description,
            description: account.description,
            price: account.price.toNumber(),
            weight: account.totalWeight.toNumber(),
            sold: account.sold.toNumber(),
            inProgress: account.inProgress.toNumber(),
            paymentMode: account.paymentMode,
            isSpl,
            paymentSymbol: isSpl ? "USDC" : "SOL",
            negotiationTiers: account.negotiationTiers.map((t) => ({
              quantity: t.quantity.toNumber(),
              discountPercentage: Number(t.discountPercentage),
            })),
          };
        })
        .sort((a, b) => a.id - b.id);
      setProducts(formatted);
    } catch (err) {
      console.error("refreshProducts failed:", err);
      setProducts([]);
    }
  }, [readProgram]);

  const refreshSellers = useCallback(async () => {
    if (!readProgram) return;
    try {
      const raw = await readProgram.account.userProfile.all();
      const formatted = raw.map(({ account }) => {
        const userTypeLabel =
          account.userType && "Seller" in account.userType ? "Seller"
          : account.userType && "Both" in account.userType ? "Both"
          : "Buyer";
        return {
          address: account.owner.toBase58(),
          id: account.profileId.toNumber(),
          name: account.name,
          location: account.location,
          mail: account.mail,
          userType: account.userType,
          userTypeLabel,
          recycledCount: account.recycledCount.toNumber(),
          totalWeight: account.recycledWeight.toNumber(),
          totalPayout: account.totalPayout.toNumber(),
        };
      });
      setSellers(formatted);
    } catch (err) {
      console.error("refreshSellers failed:", err);
      setSellers([]);
    }
  }, [readProgram]);

  const refreshPurchase = useCallback(async () => {
    if (!readProgram || !address) { setPurchaseId([]); return; }
    try {
      const escrows = await readProgram.account.escrow.all([
        { memcmp: { offset: 8, bytes: address } },
      ]);
      setPurchaseId(escrows.map(({ account }) => account.productId.toNumber()));
    } catch (err) {
      console.error("refreshPurchase failed:", err);
      setPurchaseId([]);
    }
  }, [readProgram, address]);

  useEffect(() => { refreshProducts(); refreshSellers(); }, [refreshProducts, refreshSellers]);
  useEffect(() => {
    if (isConnected && address) refreshPurchase();
    else setPurchaseId([]);
  }, [isConnected, address, refreshPurchase]);

  useProgramEvent(writeProgram, "ProductListed", () => { refreshProducts(); refreshBalance(); });
  useProgramEvent(writeProgram, "ProductUpdated", refreshProducts);
  useProgramEvent(writeProgram, "ProfileCreated", refreshSellers);
  useProgramEvent(writeProgram, "ProfileUpdated", refreshSellers);
  useProgramEvent(writeProgram, "ProductBought", () => { refreshPurchase(); refreshBalance(); refetchPendingPayments?.(); });
  useProgramEvent(writeProgram, "PaymentApproved", () => { refreshBalance(); refetchPendingPayments?.(); refetchApprovedPayments?.(); refreshPurchase(); });

  return (
    <ProductContext.Provider value={{
      products, setProducts, refreshProducts,
      purchaseId, refreshPurchase,
      sellers, setSellers, refreshSellers,
      userBal, refreshBalance,
      refetchPendingPayments, refetchApprovedPayments,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);