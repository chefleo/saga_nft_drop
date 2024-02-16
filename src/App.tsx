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
  parseEther,
} from "viem";

import { address as PM_Address } from "./constant/paymaster.json";

import { tutorialsworld } from "./lib/chainlet";

import { privateKeyToAccount } from "viem/accounts";
import LoadingNFT from "./components/LoadingNFT";
import { Toaster, toast } from "sonner";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const address = useAddress();

  const { contract: sagaNFT } = useContract(
    "0xc6117A943756157D9a7a9f3386d780D9107E4B05",
    sagaNFTAbi
  );

  const { data: nft } = useNFT(sagaNFT, "0");

  const accountDev = privateKeyToAccount(import.meta.env.VITE_PRIVATE_KEY);

  const devWallet = createWalletClient({
    account: accountDev,
    chain: tutorialsworld,
    transport: http(),
  });

  const claimNFT = async () => {
    setIsLoading(true);

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

    // @ts-ignore
    const balance = await client.readContract({
      address: EntryPointContract as `0x${string}`,
      abi: EntryPointAbi,
      functionName: "balanceOf",
      args: [PM_Address],
    });

    console.log(balance);

    // @ts-ignore
    if (formatUnits(balance, 18) > 1) {
      console.log(
        "No needed to be funded, balance of the paymaster:",
        // @ts-ignore
        formatUnits(balance, 18)
      );
    } else {
      // Fund the smart account
      await devWallet.writeContract({
        address: EntryPointContract as `0x${string}`,
        abi: EntryPointAbi,
        functionName: "depositTo",
        args: [smartWallet],
        value: parseEther("1"),
      });
      console.log("Paymaster funded");
    }

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
      PM_Address,
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

    setIsLoading(false);

    return toast.success(`NFT Claimed`, {
      action: {
        label: "See your nft",
        onClick: () =>
          parent.open(
            `https://tutorialworldtwo-2705143118829000-1.testnet-srv1.sagaexplorer.io/address/${address}?tab=tokens_erc1155`
          ),
      },
    });

    // console.log("smart wallet:", smartWallet);
    // console.log("Nonce:", Number(nonce));
    // console.log("Initcode:", initCode);
    // console.log("Balance:", balance);
  };

  return (
    <main className="w-full">
      <Toaster position="top-center" richColors />
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
              isLoading ? (
                <div
                  className={`my-8 flex justify-center items-center bg-white w-[200px] px-3 py-4 rounded-xl text-white font-semibold`}
                >
                  {/* Spinner */}
                  <div className={`h-5 w-5 inline-block relative pt-0.5`}>
                    <div className={`h-4 w-4 spinner border-t-black`}></div>
                    <div
                      className={`h-4 w-4 spinner delay_45 border-t-black`}
                    ></div>
                    <div
                      className={`h-4 w-4 spinner delay_30 border-t-black`}
                    ></div>
                    <div
                      className={`h-4 w-4 spinner delay_15 border-t-black `}
                    ></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="my-8">
                    <button
                      className="bg-white px-3 py-4 text-black font-medium rounded-xl w-[200px]"
                      onClick={() => claimNFT()}
                    >
                      Claim NFT
                    </button>
                  </div>
                </>
              )
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
