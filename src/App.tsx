import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  Web3Button,
  ThirdwebNftMedia,
  useNFT,
} from "@thirdweb-dev/react";
import "./styles/Home.css";

import { address, abi } from "./constant/addressBook.json";
import Header from "./components/Header";

export default function Home() {
  const address = useAddress();

  const { contract } = useContract(
    "0xc6117A943756157D9a7a9f3386d780D9107E4B05"
  );

  const { data: nft } = useNFT(contract, "0");

  const claimNFT = async () => {
    try {
      if (address === undefined)
        return console.log("Please connect your wallet");
      const data = await contract?.erc1155.claimTo(address, 0, 1);
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  // console.log(nft?.metadata);

  return (
    <main className="w-full">
      <Header />
      <div className="container">
        <div className="flex flex-col justify-center items-center py-8">
          <div className="flex flex-col justify-center items-center w-full sm:w-2/3 py-3 px-2 mt-4 bg-gray-900 rounded-xl">
            {nft && (
              <>
                <h1 className="text-center font-semibold text-xl sm:text-2xl my-2 sm:my-6">
                  {nft.metadata.name}
                </h1>
                <ThirdwebNftMedia metadata={nft.metadata} />
              </>
            )}
            {address ? (
              <div className="my-8">
                <Web3Button
                  contractAddress={"0xc6117A943756157D9a7a9f3386d780D9107E4B05"}
                  action={() => claimNFT()}
                >
                  Claim NFT
                </Web3Button>
              </div>
            ) : (
              <div className="p-3 my-8 bg-white text-black rounded-xl">
                Sign in to claim the nft
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
