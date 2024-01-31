import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  Web3Button,
} from "@thirdweb-dev/react";
import "./styles/Home.css";

import { address, abi } from "./constant/addressBook.json";

export default function Home() {
  const address = useAddress();

  const { contract } = useContract(
    "0xc6117A943756157D9a7a9f3386d780D9107E4B05"
  );

  const claimNFT = async () => {
    try {
      const data = await contract?.erc1155.claim(0, 1);
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  return (
    <main className="">
      <div className="container">
        <div className="flex items-center justify-between py-8">
          {/* Saga */}
          {/* Put image */}
          <p>Image</p>
          <div className="connect">
            <ConnectWallet />
          </div>
          {address ? (
            <Web3Button
              contractAddress={"0xc6117A943756157D9a7a9f3386d780D9107E4B05"}
              action={() => claimNFT()}
            >
              Claim NFT
            </Web3Button>
          ) : (
            <p>Connect your wallet</p>
          )}
        </div>
      </div>
    </main>
  );
}
