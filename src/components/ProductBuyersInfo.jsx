import React from "react";
import useGetProductBuyers from "../hooks/useGetProductBuyers";
import { formatSol, formatSpl } from "../utils/priceUtils";

const ProductBuyersInfo = ({ productId, paymentMode = { sol: {} } }) => {
  const { buyersData, loading } = useGetProductBuyers(productId);
  const isSpl = paymentMode && "spl" in paymentMode;
  const symbol = isSpl ? "USDC" : "SOL";

  const formatAmount = (amount) =>
    isSpl ? formatSpl(amount) : formatSol(amount);

  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const totalPendingRevenue = buyersData.reduce(
    (sum, b) => sum + parseFloat(formatAmount(b.amount)),
    0
  );
  const totalKgPending = buyersData.reduce(
    (sum, b) => sum + Number(b.amountBought),
    0
  );

  if (loading) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h4 className="font-bold text-lg mb-4 text-[#0F160F]">Sales Dashboard</h4>
        <p className="text-center p-4">Loading sales information…</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-6">
      <h4 className="font-bold text-lg mb-4 text-[#0F160F]">Sales Dashboard</h4>

      {buyersData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-600 font-medium">Pending Orders</p>
            <p className="text-2xl font-bold text-blue-800">{buyersData.length}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-sm text-green-600 font-medium">Kg Pending</p>
            <p className="text-2xl font-bold text-green-800">{totalKgPending}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-600 font-medium">Pending Revenue</p>
            <p className="text-2xl font-bold text-purple-800">
              {totalPendingRevenue.toFixed(4)} {symbol}
            </p>
          </div>
        </div>
      )}

      {buyersData.length === 0 ? (
        <div className="text-center p-6 text-gray-500 bg-white rounded-lg">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="font-medium">No pending purchases for this product</p>
          <p className="text-sm mt-1">New buyers appear here after purchase, before payment approval</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h5 className="font-semibold text-[#0F160F] border-b pb-2">
            Recent Buyers (Pending Payment)
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {buyersData.map((buyer, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Buyer #{index + 1}</span>
                    <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">Pending</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Address:</span>
                    <p className="text-sm font-mono text-[#0C3B45] break-all mt-1">
                      {truncateAddress(buyer.address)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs font-medium text-gray-600">Quantity</span>
                      <p className="text-lg font-bold text-green-600">{buyer.amountBought} kg</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-600">Amount</span>
                      <p className="text-lg font-bold text-[#0C3B45]">
                        {formatAmount(buyer.amount)} {symbol}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h6 className="font-semibold text-blue-800 mb-1">Payment Process</h6>
            <p className="text-sm text-blue-700">
              These buyers have purchased your product but haven't approved payment yet.
              Once they approve, escrow releases your payment automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductBuyersInfo;