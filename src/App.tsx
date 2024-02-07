import {
  useAddress,
  useContract,
  Web3Button,
  ThirdwebNftMedia,
  useNFT,
} from "@thirdweb-dev/react";
import "./styles/Home.css";

import {
  address as EntryPointContract,
  abi as EntryPointAbi,
} from "./constant/entrypoint.json";
import {
  address as accountFactoryContract,
  abi as accountFactoryAbi,
} from "./constant/accountFactory.json";

import { abi as AccountAbi } from "./constant/account.json";

import { abi as sagaNFTAbi } from "./constant/sagaNFT.json";

import Header from "./components/Header";

import {
  encodeFunctionData,
  createWalletClient,
  http,
  getContractAddress,
  createPublicClient,
  parseGwei,
} from "viem";

import { tutorialsworld } from "./lib/chainlet";

import { privateKeyToAccount } from "viem/accounts";
import LoadingNFT from "./components/LoadingNFT";

export default function Home() {
  const address = useAddress();

  const { contract: sagaNFT } = useContract(
    "0xc6117A943756157D9a7a9f3386d780D9107E4B05"
  );

  const { data: nft } = useNFT(sagaNFT, "0");

  const accountDev = privateKeyToAccount(import.meta.env.VITE_PRIVATE_KEY);

  const devWallet = createWalletClient({
    account: accountDev,
    chain: tutorialsworld,
    transport: http(),
  });

  const claimNFT = async () => {
    console.log("devWallet", devWallet);

    const client = createPublicClient({
      chain: tutorialsworld,
      transport: http(),
    });

    const smartWallet = getContractAddress({
      from: accountFactoryContract as `0x${string}`,
      nonce: 1n,
    });

    // @ts-ignore
    let nonce = await client.readContract({
      address: EntryPointContract as `0x${string}`,
      abi: EntryPointAbi,
      functionName: "getNonce",
      args: [smartWallet, 0],
    });

    let initCode = "";
    if (Number(nonce) >= 1) {
      initCode = "0x";
    } else {
      initCode =
        accountFactoryContract +
        // @ts-ignore
        encodeFunctionData({
          abi: accountFactoryAbi,
          functionName: "createAccount",
          args: [address],
        }).slice(2);
    }

    // // @ts-ignore
    // const balance = await client.readContract({
    //   address: EntryPointContract as `0x${string}`,
    //   abi: EntryPointAbi,
    //   functionName: "balanceOf",
    //   args: [smartWallet],
    // });

    // console.log(balance);

    const configClaim = [
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      0,
      [
        ["0x0000000000000000000000000000000000000000000000000000000000000000"],
        50,
        0,
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      ],
      "0x0",
    ];

    // @ts-ignore
    const encodedClaim = encodeFunctionData({
      abi: sagaNFTAbi,
      functionName: "claim",
      args: [address as string, 0, 1, ...configClaim],
    });

    // console.log("encodedClaim", encodedClaim);

    // @ts-ignore
    const callData = encodeFunctionData({
      abi: AccountAbi,
      functionName: "execute",
      args: [sagaNFT?.getAddress(), 0, encodedClaim],
    });

    const userOp = [
      smartWallet, // smart account address
      nonce,
      initCode, // Creation of the wallet if first time
      callData,

      // Gas section
      900_000,
      500_000,
      100_000,
      parseGwei("10"),
      parseGwei("5"),

      // Advanced aa section
      "0x",
      "0x",
    ];

    // @ts-ignore
    const { request } = await client.simulateContract({
      // account: address,
      address: EntryPointContract as `0x${string}`,
      abi: EntryPointAbi,
      functionName: "handleOps",
      args: [[userOp], accountDev.address],
    });

    console.log("request", request);

    // @ts-ignore
    const hash = await devWallet.writeContract(request);

    console.log(hash);

    // console.log("smart wallet:", smartWallet);
    // console.log("Nonce:", Number(nonce));
    // console.log("Initcode:", initCode);
    // console.log("Balance:", balance);
  };

  return (
    <main className="w-full">
      <Header />
      <div className="container">
        <div className="flex flex-col justify-center items-center py-8">
          <div className="flex flex-col justify-center items-center w-full sm:w-2/3 py-3 px-2 mt-4 bg-gray-900 rounded-xl">
            {nft ? (
              <>
                <h1 className="text-center font-semibold text-xl sm:text-2xl my-2 sm:my-6">
                  {nft.metadata.name}
                </h1>
                <ThirdwebNftMedia metadata={nft.metadata} />
              </>
            ) : (
              <>
                <LoadingNFT />
              </>
            )}
            {address ? (
              <div className="my-8">
                <Web3Button
                  contractAddress={EntryPointContract}
                  action={() => claimNFT()}
                >
                  Claim NFT
                </Web3Button>
              </div>
            ) : (
              <div className="p-3 my-8 bg-gray-300 text-black font-medium rounded-xl">
                Sign in to claim the nft
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
