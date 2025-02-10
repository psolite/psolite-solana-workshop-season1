import { Keypair } from "@solana/web3.js"


export const CreateWallet = () => {

    const create = Keypair.generate();

    return create
}