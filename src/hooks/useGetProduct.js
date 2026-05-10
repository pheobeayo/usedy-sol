import { useCallback, useEffect, useState } from "react";
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
  const program = useProgram(false);

  const fetchProducts = useCallback(async () => {
    if (!program) return;
    setLoading(true);
    try {
      const raw = await program.account.product.all();

      const normalized = raw
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
