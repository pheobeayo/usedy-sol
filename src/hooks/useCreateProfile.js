import { PublicKey } from "@solana/web3.js";
import { useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import useProgram from "./useProgram";
import { getProfilePDA, getPlatformConfigPDA } from "../utils/pdas";
import { getErrorMessage } from "../utils/parseAnchorError";
import { useProduct } from "../context/ContextProvider";

const useCreateProfile = () => {
  const program = useProgram(true);
  const { address: _address, isConnected } = useAppKitAccount();
  const publicKey = _address ? new PublicKey(_address) : null;
  const { refreshSellers } = useProduct();

  return useCallback(
    async (name, location, mail, userType = { buyer: {} }) => {
      if (!name || !location || !mail) {
        toast.error("Name, location and email are required");
        return;
      }

      if (!publicKey) {
        toast.error("Please connect your wallet");
        return;
      }

      if (!program) {
        toast.error("Program not initialised — check your wallet connection");
        return;
      }

      const [platformConfigPDA] = getPlatformConfigPDA();
      const [profilePDA] = getProfilePDA(publicKey);

    
      try {
        const txSig = await program.methods
          .createProfile(name, location, mail, userType)
          .accounts({
            platformConfig: platformConfigPDA,
            userProfile: profilePDA,
            user: publicKey,
          })
          .rpc();

        toast.success(`Profile created! Tx: ${txSig.slice(0, 8)}…`);
        refreshSellers?.();
        return txSig;
      } catch (err) {
        const reason = getErrorMessage(err);
        toast.error(`Failed to create profile — ${reason}`, {
          position: "top-center",
        });
        console.error("createProfile error:", err);
      }
    },
    [program, publicKey, refreshSellers]
  );
};

export default useCreateProfile;