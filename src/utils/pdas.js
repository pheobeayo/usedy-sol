

import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export const PROGRAM_ID = new PublicKey(
  "82wC4Yky79wYGoEhKfYcCCcZiTQaCBLxPqAU8tKKrDkF"
);

/** Convert a number or BN to an 8-byte little-endian Buffer (u64 seed) */
export const u64Le = (n) =>
  new BN(n).toArrayLike(Buffer, "le", 8);


/** ["platform_config"] */
export const getPlatformConfigPDA = () =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    PROGRAM_ID
  );



/** ["profile", userPubkey] */
export const getProfilePDA = (userPubkey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("profile"), userPubkey.toBuffer()],
    PROGRAM_ID
  );

// ─── Product ──────────────────────────────────────────────────────────────────

/** ["product", productId (u64 LE)] */
export const getProductPDA = (productId) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("product"), u64Le(productId)],
    PROGRAM_ID
  );

/** ["escrow", productId (u64 LE), buyerPubkey] — SOL escrow */
export const getEscrowPDA = (productId, buyerPubkey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), u64Le(productId), buyerPubkey.toBuffer()],
    PROGRAM_ID
  );

/** ["escrow_vault", productId (u64 LE), buyerPubkey] — SPL token vault */
export const getEscrowVaultPDA = (productId, buyerPubkey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("escrow_vault"), u64Le(productId), buyerPubkey.toBuffer()],
    PROGRAM_ID
  );



/** ["request", requestId (u64 LE)] */
export const getRequestPDA = (requestId) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("request"), u64Le(requestId)],
    PROGRAM_ID
  );

/** ["offer", offerId (u64 LE)] */
export const getOfferPDA = (offerId) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("offer"), u64Le(offerId)],
    PROGRAM_ID
  );

/** ["offer_escrow", offerId (u64 LE), buyerPubkey] — SOL offer escrow */
export const getOfferEscrowPDA = (offerId, buyerPubkey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("offer_escrow"), u64Le(offerId), buyerPubkey.toBuffer()],
    PROGRAM_ID
  );

/** ["offer_escrow_vault", offerId (u64 LE), buyerPubkey] — SPL offer vault */
export const getOfferEscrowVaultPDA = (offerId, buyerPubkey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("offer_escrow_vault"), u64Le(offerId), buyerPubkey.toBuffer()],
    PROGRAM_ID
  );