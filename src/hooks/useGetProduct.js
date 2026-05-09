import { useCallback, useEffect, useState } from "react";
import { BN } from "@coral-xyz/anchor";
import useProgram from "./useProgram";

const convertIpfsUrl = (url) => {
  if (!url) return "";
  return url.startsWith("ipfs://")
    ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
    : url;
};

const useGetProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const program = useProgram(false); // read-only

  const fetchProducts = useCallback(async () => {
    if (!program) return;
    setLoading(true);
    try {
      const raw = await program.account.product.all();

      const normalized = raw.map(({ publicKey, account }) => ({
        publicKey: publicKey.toBase58(),
        productId: account.productId.toNumber(),
        address: account.owner.toBase58(),         // seller wallet
        name: account.name,
        image: convertIpfsUrl(account.image),
        location: account.location,
        product: account.description,              // aliased for UI compat
        description: account.description,
        price: account.price,                      // BN — keep as BN for math
        priceNumber: account.price.toNumber(),     // convenience
        weight: account.totalWeight,               // BN
        weightNumber: account.totalWeight.toNumber(),
        sold: account.sold.toNumber(),
        inProgress: account.inProgress.toNumber(),
        paymentMode: account.paymentMode,          // { sol:{} } | { spl:{} }
        negotiationTiers: account.negotiationTiers.map((t) => ({
          quantity: t.quantity.toNumber(),
          discountPercentage: t.discountPercentage,
        })),
      }));

      // Sort by productId ascending
      normalized.sort((a, b) => a.productId - b.productId);
      setProducts(normalized);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [program]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    product: products,   
    products,
    loading,
    refreshProducts: fetchProducts,
  };
};

export default useGetProduct;