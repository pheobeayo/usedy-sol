import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaDevnet, solanaTestnet } from "@reown/appkit/networks";


const solanaAdapter = new SolanaAdapter();

const projectId = import.meta.env.VITE_PROJECTID;


const metadata = {
  name: "Usedy",
  description: "Decentralised marketplace on Solana",
  url: "http://localhost:5173",
  icons: ["./mark.svg"],
};

const networkEnv = import.meta.env.VITE_SOLANA_NETWORK ?? "devnet";
const defaultNetwork =
  networkEnv === "mainnet" ? solana
  : networkEnv === "testnet" ? solanaTestnet
  : solanaDevnet;


createAppKit({
  adapters: [solanaAdapter],
  networks: [solana, solanaDevnet, solanaTestnet],
  metadata,
  projectId,
  features: {
    analytics: true,
  },
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "#3B82F6",
  },
  defaultNetwork,
});

export { solana, solanaDevnet, solanaTestnet };