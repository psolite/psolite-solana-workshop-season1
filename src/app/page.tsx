"use client";

import { CreateWallet } from "@/comp/createWallet";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58"
import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const { publicKey } = useWallet()

  const wallet = () => {
    const create = CreateWallet()

    const addressu = create.publicKey.toString()
    setAddress(addressu)
    const privateKeyu = bs58.encode(create.secretKey)
    setPrivateKey(privateKeyu)
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <WalletMultiButton />


      {publicKey ?
        <>
          <button onClick={wallet}> Create Wallet</button>
          <p>{address}</p>
          <p>{privateKey}</p>
        </> : ""

      }

    </div>
  );
}
