import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../context/ContextProvider";
import LoadingSpinner from "../../components/Loader/LoadingSpinner";
import { formatUnits } from "ethers";
import Banner from "../../components/Banner";
import EditProduct from "../../components/EditProduct";
import BuyProduct from "../../components/BuyProduct";
import ProductBuyersInfo from "../../components/ProductBuyersInfo";
import { useAppKitAccount } from "@reown/appkit/react";

const MarketplaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products }= useProduct();
  const [transaction, setTransaction] = useState(null);
  const { address } = useAppKitAccount();

  useEffect(() => {
    if (products.length > 0) {
      const foundTransaction = products.find(
        (data) => String(data?.id) === id
      );
      setTransaction(foundTransaction);
    }
  }, [products, id]);

  const truncateAddress = (address) => {
    if (!address) return "";
    const start = address.slice(0, 20);
    return `${start}...`;
  };

  const handleChatSeller = () => {
    navigate(`/dashboard/chat`);
  };

  return (
    <main>
      <Banner />
      {transaction ? (
        <div className="w-[100%] mx-auto">
          <h2 className="lg:text-[28px] md:text-[28px] text-[20px] text-[#0F160F] font-bold my-6 font-titiliumweb" key={transaction.id}>
            Product Details
          </h2>
          <section className="flex lg:flex-row md:flex-row flex-col justify-between">
            <div className="lg:w-[45%] md:w-[45%] w-[100%]">
              <img
                src={transaction.image}
                alt=""
                className="rounded-lg w-[100%]"
              />
            </div>
            <div className="text-[#0F160F] lg:w-[52%] md:w-[52%] w-[100%]">
              <h3 className="font-bold mt-4 lg:mt-0 md:mt-0 lg:text-[24px] md:text-[24px] text-[20px] capitalise font-titiliumweb">
                {transaction.name}
              </h3>
              <p className="font-titiliumweb mb-4 font-bold text-[#0C3B45] lg:text-[24px] md:text-[24px] text-[20px]">
                {formatUnits(transaction.price)} U2U(per unit of measure){" "}
              </p>
              <p className="flex justify-between my-4">
                Quantity available: <span className={Number(transaction.weight) === 0 ? 'text-red-500 font-bold' : ''}>{Number(transaction.weight) === 0 ? '0 (Out of Stock)' : Number(transaction.weight)}</span>
              </p>
              <p className="flex justify-between my-4">
                Seller's location: <span>{transaction.location}</span>
              </p>
              <p className="flex justify-between my-4">
                Seller's wallet address:{" "}
                <span>{truncateAddress(transaction.address)}</span>
              </p>
              
              {/* Action buttons section */}
              <div className="flex flex-col gap-3 my-6">
                {transaction.address.toLowerCase() === address?.toLowerCase() ? (
                  <EditProduct id={id} productData={transaction} />
                ) : (
                  <>
                    {Number(transaction.weight) === 0 ? (
                      <button
                        disabled
                        className="bg-gray-400 text-gray-600 py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-2 cursor-not-allowed font-titiliumweb"
                      >
                        Out of Stock
                      </button>
                    ) : (
                      <BuyProduct id={id} price={formatUnits(transaction.price)} />
                    )}
                    <button
                      onClick={handleChatSeller}
                      className="bg-[#263E59] text-white py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold transition-colors duration-200 font-titiliumweb"
                    >
                      Chat with Seller
                    </button>
                  </>
                )}
              </div>

              <p>
                Kindly drop a comment upon receipt of your products. This is
                crucial to ensure the seller receives their payment promptly.{" "}
                <a href="#" className="text-[#263E59] font-bold">
                  Learn More
                </a>
              </p>
            </div>
          </section>

          {/* Product Buyers Information - Only visible to the seller */}
          {transaction.address.toLowerCase() === address?.toLowerCase() && (
            <ProductBuyersInfo 
              productId={id} 
              productPrice={transaction.price}
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