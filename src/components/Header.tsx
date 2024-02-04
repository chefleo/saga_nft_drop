import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import Saga from "/saga.svg";

function Header() {
  return (
    <div className="flex justify-between items-center h-20 sm:h-24 bg-slate-800 px-5 sm:px-20">
      <div className="flex items-center">
        <img className="h-12 w-12" src={Saga} alt="Saga" />
      </div>
      <div className="ml-10 flex items-center justify-center text-white">
        <ConnectWallet btnTitle={"Sign in"} modalSize={"compact"} />
      </div>
    </div>
  );
}

export default Header;
