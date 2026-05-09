

import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaDevnet, solanaTestnet } from "@reown/appkit/networks";


const solanaAdapter = new SolanaAdapter();


const projectId = import.meta.env.VITE_PROJECTID;

const metadata = {
  name: "U-Market",
  description: "Decentralised agricultural marketplace on Solana",
  url: import.meta.env.VITE_APP_URL ?? "http://localhost:5173",
  icons: ["./mark.svg"],
};


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
  defaultNetwork: solanaDevnet, 
});

export { solana, solanaDevnet, solanaTestnet };