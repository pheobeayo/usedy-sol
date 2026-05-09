import { ethers, JsonRpcProvider } from "ethers";
import tokenAbi from "./tokenAbi.json";

const readOnlyProvider = new JsonRpcProvider(import.meta.env.VITE_RPC_PROVIDER);

export const tokenContract = new ethers.Contract(
    import.meta.env.VITE_USEDYTOKEN_ADDRESS,
    tokenAbi,
    readOnlyProvider
  );
