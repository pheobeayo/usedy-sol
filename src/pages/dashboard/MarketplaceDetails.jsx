import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { useProduct } from "../../context/ContextProvider";
import LoadingSpinner from "../../components/Loader/LoadingSpinner";
import Banner from "../../components/Banner";
import EditProduct from "../../components/EditProduct";
import BuyProduct from "../../components/BuyProduct";
import ProductBuyersInfo from "../../components/ProductBuyersInfo";
import { formatPrice } from "../../utils/priceUtils";

const MarketplaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProduct();
  const { address } = useAppKitAccount();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((d) => String(d?.id) === id);
      setTransaction(found ?? null);
    }
  }, [products, id]);

  // Solana addresses are 44-char base58; show first 20 chars
  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 20)}…`;
  };

  const isOwner =
    transaction &&
    address &&
    transaction.address.toLowerCase() === address.toLowerCase();

  const outOfStock = transaction && transaction.weight === 0;

  return (
    <main>
      <Banner />
      {transaction ? (
        <div className="w-full mx-auto">
          <h2
            className="lg:text-[28px] md:text-[28px] text-[20px] text-[#0F160F] font-bold my-6 font-titiliumweb"
            key={transaction.id}
          >
            Product Details
          </h2>

          <section className="flex lg:flex-row md:flex-row flex-col justify-between">
            {/* Image */}
            <div className="lg:w-[45%] md:w-[45%] w-full">
              <img
                src={transaction.image}
                alt={transaction.name}
                className="rounded-lg w-full"
              />
            </div>

            {/* Details */}
            <div className="text-[#0F160F] lg:w-[52%] md:w-[52%] w-full">
              <h3 className="font-bold mt-4 lg:mt-0 lg:text-[24px] text-[20px] capitalize font-titiliumweb">
                {transaction.name}
              </h3>

              {/* Price — auto-formatted for SOL or SPL */}
              {(() => {
                const { formatted, symbol } = formatPrice(
                  transaction.price,
                  transaction.paymentMode
                );
                return (
                  <p className="font-titiliumweb mb-4 font-bold text-[#0C3B45] lg:text-[24px] text-[20px]">
                    {formatted} {symbol} (per kg)
                  </p>
                );
              })()}

              <p className="flex justify-between my-4">
                Quantity available:{" "}
                <span className={outOfStock ? "text-red-500 font-bold" : ""}>
                  {outOfStock ? "0 (Out of Stock)" : transaction.weight}
                </span>
              </p>
              <p className="flex justify-between my-4">
                Seller&apos;s location:{" "}
                <span>{transaction.location}</span>
              </p>
              <p className="flex justify-between my-4">
                Seller&apos;s wallet:{" "}
                <span className="font-mono text-sm">
                  {truncateAddress(transaction.address)}
                </span>
              </p>

              {/* Payment mode badge */}
              <div className="my-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    transaction.paymentMode && "spl" in transaction.paymentMode
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {transaction.paymentMode && "spl" in transaction.paymentMode
                    ? "USDC payment"
                    : "SOL payment"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 my-6">
                {isOwner ? (
                  // Seller sees Edit button (disabled when inProgress > 0)
                  <EditProduct id={id} productData={transaction} />
                ) : (
                  <>
                    {outOfStock ? (
                      <button
                        disabled
                        className="bg-gray-400 text-gray-600 py-2 px-4 rounded-lg lg:text-[20px] font-bold text-[16px] w-full my-2 cursor-not-allowed font-titiliumweb"
                      >
                        Out of Stock
                      </button>
                    ) : (
                      // BuyProduct receives raw BN price + paymentMode + tiers
                      // It handles its own display and instruction routing
                      <BuyProduct
                        id={transaction.id}
                        price={transaction.price}
                        paymentMode={transaction.paymentMode}
                        tiers={transaction.negotiationTiers}
                      />
                    )}
                    <button
                      onClick={() => navigate("/dashboard/chat")}
                      className="bg-[#263E59] text-white py-2 px-4 rounded-lg lg:text-[20px] font-bold text-[16px] w-full my-2 hover:bg-[#1e3147] transition-colors font-titiliumweb"
                    >
                      Chat with Seller
                    </button>
                  </>
                )}
              </div>

              <p className="text-sm">
                Kindly drop a comment upon receipt of your products. This is
                crucial to ensure the seller receives their payment promptly.{" "}
                <a href="#" className="text-[#263E59] font-bold">
                  Learn More
                </a>
              </p>
            </div>
          </section>

          {/* Sales dashboard — only visible to the product owner */}
          {isOwner && (
            <ProductBuyersInfo
              productId={transaction.id}
              paymentMode={transaction.paymentMode}
            />
          )}
        </div>
      ) : (
        <div>
          <LoadingSpinner />
        </div>
      )}
    </main>
  );
};

export default MarketplaceDetails;