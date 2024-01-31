import {
  ConnectWallet,
  useContract,
  useContractRead,
  useContractWrite,
  Web3Button,
} from "@thirdweb-dev/react";
import "./styles/Home.css";

import { address, abi } from "./constant/addressBook.json";

export default function Home() {
  // const { contract } = useContract(address, abi);

  const { contract } = useContract(
    "0x8e7C31ba0bB7d37251A6c3b9F6a9A2fD6fA55f76"
  );

  const { data: totalSupply, isLoading } = useContractRead(
    contract,
    "totalSupply"
  );

  // console.log("totalSupply", totalSupply.toString());

  // const { data: Contacts } = useContractRead(contract, "getContacts");

  // console.log("contacts", Contacts);
  // console.log("abi", abi);

  // const { mutate: addContact } = useContractWrite(contract, "addContact");

  return (
    <main className="main">
      <div className="container">
        <div className="header">
          <h1 className="title">
            Welcome to{" "}
            <span className="gradient-text-0">
              <a
                href="https://thirdweb.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                thirdweb.
              </a>
            </span>
          </h1>

          <p className="description">
            Get started by configuring your desired network in{" "}
            <code className="code">src/index.js</code>, then modify the{" "}
            <code className="code">src/App.js</code> file!{" "}
          </p>

          <div className="connect">
            <ConnectWallet />
          </div>
          {/* <Web3Button
            contractAddress={"0x7325BD0BD2dcd2cDfC5f43A2763a43bcFdA202e3"}
            action={() =>
              addContact({
                args: ["0x03305A2C9d2030841576F7480D7E2eE45599f7D1", "John"],
              })
            }
          >
            Test Add Contact
          </Web3Button> */}
        </div>

        <div className="grid">
          <a
            href="https://portal.thirdweb.com/"
            className="card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/portal-preview.png"
              alt="Placeholder preview of starter"
            />
            <div className="card-text">
              <h2 className="gradient-text-1">Portal ➜</h2>
              <p>
                Guides, references, and resources that will help you build with
                thirdweb.
              </p>
            </div>
          </a>

          <a
            href="https://thirdweb.com/dashboard"
            className="card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/dashboard-preview.png"
              alt="Placeholder preview of starter"
            />
            <div className="card-text">
              <h2 className="gradient-text-2">Dashboard ➜</h2>
              <p>
                Deploy, configure, and manage your smart contracts from the
                dashboard.
              </p>
            </div>
          </a>

          <a
            href="https://thirdweb.com/templates"
            className="card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/templates-preview.png"
              alt="Placeholder preview of templates"
            />
            <div className="card-text">
              <h2 className="gradient-text-3">Templates ➜</h2>
              <p>
                Discover and clone template projects showcasing thirdweb
                features.
              </p>
            </div>
          </a>
        </div>
      </div>
    </main>
  );
}
