import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThirdwebProvider, embeddedWallet } from "@thirdweb-dev/react";
import "./styles/globals.css";

const chainlet = {
  // Required information for connecting to the network
  chainId: 2705143118829000, // Chain ID of the network
  rpc: [
    "https://tutorialworldtwo-2705143118829000-1.jsonrpc.testnet-sp1.sagarpc.io",
  ], // Array of RPC URLs to use

  // Information for adding the network to your wallet (how it will appear for first time users) === \\
  // Information about the chain's native currency (i.e. the currency that is used to pay for gas)
  nativeCurrency: {
    decimals: 18,
    name: "TWT",
    symbol: "TWT",
  },
  shortName: "tutworld2", // Display value shown in the wallet UI
  slug: "tutorial", // Display value shown in the wallet UI
  testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
  chain: "tutorialsworldtwo", // Name of the network
  name: "Tutorials World 2", // Name of the network
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={chainlet}
      clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
      supportedWallets={[
        embeddedWallet({
          auth: {
            options: ["google", "email"],
          },
        }),
      ]}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
