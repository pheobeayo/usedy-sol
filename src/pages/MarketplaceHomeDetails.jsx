import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import useGetProduct from "../hooks/useGetProduct";
import LoadingSpinner from "../components/Loader/LoadingSpinner";
import BuyProduct from "../components/BuyProduct";
import { formatPrice } from "../utils/priceUtils";

const MarketplaceHomeDetails = () => {
  const { id } = useParams();
  const { product } = useGetProduct();
  const [transaction, setTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (product.length > 0) {
      const found = product.find((d) => String(d?.id) === id);
      setTransaction(found ?? null);
    }
  }, [product, id]);

  // Solana base58 addresses are 44 chars — show more than the EVM 20-char truncation
  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 16)}…`;
  };

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <LoadingSpinner />
      </div>
    );
  }

  const { formatted, symbol } = formatPrice(
    transaction.price,
    transaction.paymentMode
  );

  return (
    <main>
      <div className="w-[95%] mx-auto p-8">
        <h2 className="lg:text-[28px] md:text-[28px] text-[18px] text-[#0F160F] font-bold mb-2 font-titiliumweb">
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
            <p className="font-titiliumweb mb-4 font-bold text-[#3F9AAE] lg:text-[24px] text-[20px]">
              {formatted} {symbol} (per kg)
            </p>
            <p className="flex justify-between my-4">
              Quantity available: <span>{transaction.weight}</span>
            </p>
            <p className="flex justify-between my-4">
              Seller&apos;s location: <span>{transaction.location}</span>
            </p>
            <p className="flex justify-between my-4">
              Seller&apos;s wallet:{" "}
              <span className="font-mono text-sm">
                {truncateAddress(transaction.address)}
              </span>
            </p>

            {/* Payment mode badge */}
            <div className="my-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  "spl" in (transaction.paymentMode ?? {})
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {symbol} payment
              </span>
            </div>

            {/* Buy button — passes paymentMode + tiers so BuyProduct uses the right instruction */}
            <BuyProduct
              id={transaction.id}
              price={transaction.price}
              paymentMode={transaction.paymentMode}
              tiers={transaction.negotiationTiers}
            />

            <button
              className="bg-white w-full py-2 text-[#3F9AAE] border border-[#3F9AAE] mb-4 rounded"
              onClick={() => setShowModal(true)}
            >
              Add Comment
            </button>

            <p className="text-sm">
              Kindly drop a comment upon receipt of your products. This is crucial
              to ensure the seller receives their payment promptly.{" "}
              <a href="#" className="text-[#3F9AAE] font-bold">
                Learn More
              </a>
            </p>
          </div>
        </section>
      </div>

      {/* Connect wallet prompt modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg text-[#0F160F] flex flex-col items-center">
            <IoClose
              className="self-end mb-4 font-bold text-2xl cursor-pointer"
              onClick={() => setShowModal(false)}
            />
            <p className="mb-4">Kindly connect your wallet to proceed</p>
            {/* AppKit web component — same as w3m-button in the EVM version */}
            <appkit-button />
          </div>
        </div>
      )}
    </main>
  );
};

export default MarketplaceHomeDetails;