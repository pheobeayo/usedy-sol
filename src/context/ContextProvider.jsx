import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { PublicKey } from "@solana/web3.js";
import useProgram from "../hooks/useProgram";
import useProgramEvent from "../hooks/useProgramEvent";
import useGetUsedyToken from "../hooks/useGetUsedyToken";
import useGetPendingPayments from "../hooks/useGetPendingPayments";
import { useGetApprovedPayments } from "../hooks/useGetPayments";

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
        .map(({ publicKey, account }) => ({
          // Keep id as productId number for URL routing (/marketplace/:id)
          id: account.productId.toNumber(),
          publicKey: publicKey.toBase58(),
          address: account.owner.toBase58(),         // seller wallet (base58)
          name: account.name,
          image: convertIpfsUrl(account.image),
          location: account.location,
          product: account.description,              
          description: account.description,
          // Keep price as BN — components that need display call lamportsToSol()
          price: account.price,
          // Convenience number for components that do Number(info.weight)
          weight: account.totalWeight.toNumber(),
          sold: account.sold.toNumber(),
          inProgress: account.inProgress.toNumber(),
          paymentMode: account.paymentMode,          // { sol:{} } | { spl:{} }
          negotiationTiers: account.negotiationTiers.map((t) => ({
            quantity: t.quantity.toNumber(),
            discountPercentage: t.discountPercentage,
          })),
        }))
        .sort((a, b) => a.id - b.id);
      setProducts(formatted);
    } catch (err) {
      console.error("refreshProducts failed:", err);
      setProducts([]);
    }
  }, [readProgram]);

  // ── refreshSellers ──────────────────────────────────────────────────────────
  const refreshSellers = useCallback(async () => {
    if (!readProgram) return;
    try {
      const raw = await readProgram.account.userProfile.all();
      const formatted = raw.map(({ account }) => ({
        address: account.owner.toBase58(),
        id: account.profileId.toNumber(),
        name: account.name,
        location: account.location,
        mail: account.mail,
        userType: account.userType,                  
        recycledCount: account.recycledCount.toNumber(),
        totalWeight: account.recycledWeight.toNumber(),
        totalPayout: account.totalPayout.toNumber(),
      }));
      setSellers(formatted);
    } catch (err) {
      console.error("refreshSellers failed:", err);
      setSellers([]);
    }
  }, [readProgram]);

  
  const refreshPurchase = useCallback(async () => {
    if (!readProgram || !address) {
      setPurchaseId([]);
      return;
    }
    try {
      
      const escrows = await readProgram.account.escrow.all([
        {
          memcmp: {
            offset: 8, // skip discriminator; buyer pubkey is the first field
            bytes: address, // AppKit address is already base58
          },
        },
      ]);
      const ids = escrows.map(({ account }) => account.productId.toNumber());
      setPurchaseId(ids);
    } catch (err) {
      console.error("refreshPurchase failed:", err);
      setPurchaseId([]);
    }
  }, [readProgram, address]);

    useEffect(() => {
    refreshProducts();
    refreshSellers();
  }, [refreshProducts, refreshSellers]);

  useEffect(() => {
    if (isConnected && address) {
      refreshPurchase();
    } else {
      setPurchaseId([]);
    }
  }, [isConnected, address, refreshPurchase]);

  useProgramEvent(writeProgram, "ProductListed", () => {
    refreshProducts();
    refreshBalance();
  });
  useProgramEvent(writeProgram, "ProductUpdated", refreshProducts);
  useProgramEvent(writeProgram, "ProfileCreated", refreshSellers);
  useProgramEvent(writeProgram, "ProfileUpdated", refreshSellers);
  useProgramEvent(writeProgram, "ProductBought", () => {
    refreshPurchase();
    refreshBalance();
    refetchPendingPayments?.();
  });
  useProgramEvent(writeProgram, "PaymentApproved", () => {
    refreshBalance();
    refetchPendingPayments?.();
    refetchApprovedPayments?.();
    refreshPurchase();
  });

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        refreshProducts,
        purchaseId,
        refreshPurchase,
        sellers,
        setSellers,
        refreshSellers,
        userBal,
        refreshBalance,
        refetchPendingPayments,
        refetchApprovedPayments,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);