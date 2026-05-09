import { Link } from "react-router-dom";
import { useProduct } from "../context/ContextProvider";
import { formatPrice } from "../utils/priceUtils";

const ProductCard = () => {
  const { products } = useProduct();

  return (
    <div className="flex lg:flex-row md:flex-row flex-col justify-between items-center my-10 flex-wrap">
      {products.map((info) => {
        const { formatted, symbol } = formatPrice(info.price, info.paymentMode);
        const outOfStock = info.weight === 0;

        return (
          <div
            className="lg:w-[32%] md:w-[32%] w-full p-4 border border-[#0F160F]/20 rounded-lg mb-4 shadow-lg relative"
            key={info.id}
          >
            {outOfStock && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                Out of Stock
              </div>
            )}
            <div className={`text-[#0F160F] ${outOfStock ? "opacity-75" : ""}`}>
              <img
                src={info.image}
                alt={info.name}
                className="w-full h-[237px] object-cover object-center rounded-lg"
              />
              <h3 className="font-bold mt-4 lg:text-[20px] md:text-[20px] text-[18px] capitalize">
                {info.name}
              </h3>
              <p className="flex justify-between my-4">
                Quantity{" "}
                <span className={outOfStock ? "text-red-500 font-bold" : ""}>
                  {outOfStock ? "0 (Out of Stock)" : info.weight}
                </span>
              </p>
              <p className="flex justify-between my-4">
                Seller&apos;s location <span>{info.location}</span>
              </p>
              <p className="flex justify-between my-4 font-bold">
                Price{" "}
                <span>
                  {formatted} {symbol}
                </span>
              </p>

              {outOfStock ? (
                <button
                  disabled
                  className="my-4 border w-full py-2 px-4 rounded-lg border-gray-400 text-gray-400 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : (
                <Link to={`/dashboard/market_place/${info.id}`} className="block">
                  <button className="my-4 border w-full py-2 px-4 border-[#0C3B45] text-[#0C3B45] rounded-lg hover:bg-[#0C3B45] hover:text-white transition-colors duration-200">
                    View details
                  </button>
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCard;