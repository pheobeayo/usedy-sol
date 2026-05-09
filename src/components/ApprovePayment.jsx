import React, { useState } from "react";
import { toast } from "react-toastify";
import useApprovePayment from "../hooks/useApprovePayment";

const ApprovePayment = ({ productId, paymentMode = "sol", onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const approvePayment = useApprovePayment();

  const handleApprovePayment = async () => {
    if (productId === undefined || productId === null) {
      toast.error("Invalid product ID");
      return;
    }

    setLoading(true);
    try {
      const success = await approvePayment(productId, paymentMode);
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error approving payment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApprovePayment}
      disabled={loading}
      className={`w-full py-2 px-4 rounded-lg font-bold transition-colors ${
        loading
          ? "bg-gray-400 cursor-not-allowed text-gray-700"
          : "bg-green-600 hover:bg-green-700 text-white"
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Approving…
        </span>
      ) : (
        "Approve Payment ✓"
      )}
    </button>
  );
};

export default ApprovePayment;