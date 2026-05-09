
import { AnchorError } from "@coral-xyz/anchor";


const UMARKET_ERRORS = {
  6000: "You don't have a profile yet",          // NotRegistered       0x1770
  6001: "Profile already exists",                 // AlreadyRegistered   0x1771
  6002: "Required field cannot be empty",         // EmptyString         0x1772
  6003: "Product or request not available",       // NotAvailable        0x1773
  6004: "Amount must be greater than zero",       // InvalidAmount       0x1774
  6005: "Not enough product weight in stock",     // NotEnoughProduct    0x1775
  6006: "Cannot update product while escrow is active", // PurchaseInProgress 0x1776
  6007: "Invalid ID provided",                    // InvalidId           0x1777
  6008: "You are not the owner of this resource", // NotOwner            0x1778
  6009: "Missing buyer or seller role",           // UnauthorizedRole    0x1779
  6010: "This offer has expired",                 // OfferExpired        0x177a
  6011: "Offer has not been accepted yet",        // OfferNotAccepted    0x177b
  6012: "This request has expired",               // RequestExpired      0x177c
  6013: "This request is no longer active",       // RequestInactive     0x177d
  6014: "Offer price exceeds request max price",  // PriceTooHigh        0x177e
  6015: "Offered quantity is below requested",    // QuantityInsufficient 0x177f
  6016: "Discount must be between 1 and 99",      // InvalidDiscount     0x1780
  6017: "Price and weight must be greater than zero", // InvalidPrice    0x1781
  6018: "Deadline must be in the future",         // InvalidDeadline     0x1782
  6019: "Fee must be between 0 and 99",           // InvalidFee          0x1783
  6020: "Payment mode mismatch (SOL vs SPL)",     // PaymentModeMismatch 0x1784
  6021: "Arithmetic overflow",                    // Overflow            0x1785
  6022: "Maximum of 5 negotiation tiers allowed", // TooManyTiers        0x1786
  6023: "This offer has already been accepted",   // OfferAlreadyAccepted 0x1787
  6024: "Delivery has already been confirmed",    // OfferAlreadyDelivered 0x1788
  6025: "Only the accepting buyer can confirm",   // NotYourOffer        0x1789
  6026: "No escrowed payment found",              // NoPaymentFound      0x178a
};

/**
 * Extract a human-readable reason from an Anchor/Solana error.
 *
 * @param {unknown} err - The caught error
 * @returns {string} A display-ready error message
 */
export const getErrorMessage = (err) => {
  // Anchor typed error (best case — has errorCode.number)
  if (err instanceof AnchorError) {
    const code = err.error?.errorCode?.number;
    if (code !== undefined && UMARKET_ERRORS[code]) {
      return UMARKET_ERRORS[code];
    }
    // Fall back to Anchor's own message
    return err.error?.errorMessage ?? err.message ?? "Transaction failed";
  }

  // Anchor error embedded inside a SendTransactionError logs string
  const msg = err?.message ?? "";

  // Try to parse error code from logs like "custom program error: 0x1770"
  const hexMatch = msg.match(/custom program error:\s*(0x[0-9a-fA-F]+)/i);
  if (hexMatch) {
    const decimal = parseInt(hexMatch[1], 16);
    // Anchor custom errors start at 6000 (0x1770)
    if (UMARKET_ERRORS[decimal]) return UMARKET_ERRORS[decimal];
  }

  // Solana user rejection
  if (msg.includes("User rejected") || msg.includes("cancelled")) {
    return "Transaction cancelled by wallet";
  }

  // Insufficient funds
  if (msg.includes("insufficient lamports") || msg.includes("0x1")) {
    return "Insufficient SOL balance for this transaction";
  }

  return msg || "An unknown error occurred";
};