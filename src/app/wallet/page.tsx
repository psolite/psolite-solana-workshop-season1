"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Connection, LAMPORTS_PER_SOL, ParsedAccountData, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { create } from "domain";

const connection = new Connection("https://api.devnet.solana.com");

export default function Checker() {
    const [isLoading, setIsLoading] = useState(false);
    const { publicKey, sendTransaction } = useWallet();
    const [tokens, setTokens] = useState<any[]>([]);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [solBalance, setSolBalance] = useState(0);

    useEffect(() => {
        const get = async () => {

            await getSolBalance();
            await getSPLToken();

        }
        get();

    }, [publicKey])



    const getSolBalance = async () => {
        if (!publicKey) return;
        // const userPub = new PublicKey("6ZY41CVcdL7VNCgZsh29h2KuUjqdVLw9At6EpL5x3aQt")
        await connection.getBalance(publicKey).then((info) => {
            console.log(info);
            if (info) {
                setSolBalance(info / LAMPORTS_PER_SOL);
            }
        });
    }

    const solAirdrop = async () => {
        if (!publicKey) return;


        const signature = await connection.requestAirdrop(
            publicKey,
            LAMPORTS_PER_SOL,
        );
        const { blockhash, lastValidBlockHeight } =
            await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature,
        });

        alert(`Airdrop completed ${signature}`);
    }

    const sendSol = async () => {
        if (!publicKey) return;
        try {
            setIsLoading(true)
            const recipientPubKey = new PublicKey(recipientAddress)

            const tx = new Transaction();

            tx.add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubKey,
                    lamports: +amount * 1e9
                })
            )

            tx.feePayer = publicKey;

            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

            tx.recentBlockhash = blockhash;
            tx.lastValidBlockHeight = lastValidBlockHeight;

            const signature = await sendTransaction(tx, connection);

            await connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature,
            });


            alert(`Transaction completed ${signature}`);
        } catch (error) {
            alert(`Error: ${error}`);
        } finally {
            setIsLoading(false);
        }

    }

    const getSPLToken = async () => {
        if(!publicKey) return;
        const userTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey,{
            programId: TOKEN_PROGRAM_ID
        })
        
        const tokens = await Promise.all(userTokenAccounts.value.map((info) => {
            const token = info.account.data.parsed.info;
            return{
                mint: token.mint,
                balance: token.tokenAmount.uiAmountString,
            }
        }))

        setTokens(tokens);
    }


    const sendSPL = async (mint: string) => {
        if (!publicKey) return;
        try {
            setIsLoading(true)
            const recipientPubKey = new PublicKey(recipientAddress)

            const tx = new Transaction();
            const mintPubKey = new PublicKey(mint);

            const userTokenAccount = await getAssociatedTokenAddress(mintPubKey, publicKey);
            const toTokenAccount = await getAssociatedTokenAddress(mintPubKey, recipientPubKey);

            const checkATA = await connection.getAccountInfo(toTokenAccount);

            if(!checkATA) {
                tx.add(
                    createAssociatedTokenAccountInstruction(
                        publicKey,
                        toTokenAccount,  
                        recipientPubKey,
                        mintPubKey
                    )
                )
            }

            const dec = await getTokenDecimals(mintPubKey)
            
            const amountBigInt = +amount * Math.pow(10, dec)

            tx.add(
                createTransferInstruction(
                    userTokenAccount,
                    toTokenAccount,
                    publicKey,
                    amountBigInt,
                  ), 
            )

            tx.feePayer = publicKey;

            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

            tx.recentBlockhash = blockhash;

            const signature = await sendTransaction(tx, connection);

            await connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature,
            });

            alert(`Transaction completed ${signature}`);
        } catch (error) {
            alert(`Error: ${error}`);
        } finally {
            setIsLoading(false);
        }

    }

    const getTokenDecimals = async (mint: PublicKey) => {
        const info = await connection.getParsedAccountInfo(mint);

        if (!info.value) {
            throw Error("Failed to fetch Decimal")
        }

        return (info.value.data as ParsedAccountData).parsed.info.decimals as number
    }




    return (



        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Solana Wallet</h1>
                <WalletMultiButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
                {publicKey && (
                    <div className="mt-4">
                        <p className="text-gray-700">Connected Wallet: {publicKey.toBase58()}</p>
                        <button
                            onClick={solAirdrop}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        >
                            Sol Airdrop
                        </button>
                        <h2 className="text-xl font-bold mt-4">Your Tokens</h2>
                        <ul className="mt-2">
                            <li className="text-green-700">
                                Solana (SOL): {solBalance}
                                {selectedToken === "SOL" ? (
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            placeholder="Recipient Address"
                                            value={recipientAddress}
                                            onChange={(e) => setRecipientAddress(e.target.value)}
                                            className="border border-gray-300 rounded px-2 py-1 mr-2"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="border border-gray-300 rounded px-2 py-1 mr-2"
                                        />
                                        <button
                                            onClick={() => sendSol() }
                                            disabled={isLoading}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                            Confirm Send
                                        </button>
                                        <button
                                            onClick={() => setSelectedToken(null)}
                                            disabled={isLoading}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setSelectedToken("SOL")}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2 items-end"
                                    >
                                        Send
                                    </button>
                                )}
                            </li>
                            {tokens.map((token, index) => (
                                <li key={index} className="text-gray-700">
                                    {token.mint}, Balance: {token.balance}

                                    {selectedToken === token.mint ? (
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                placeholder="Recipient Address"
                                                value={recipientAddress}
                                                onChange={(e) => setRecipientAddress(e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 mr-2"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 mr-2"
                                            />
                                            <button
                                                onClick={() => sendSPL(token.mint)}
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Confirm Send
                                            </button>
                                            <button
                                                onClick={() => setSelectedToken(null)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedToken(token.mint)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2 items-end"
                                        >
                                            Send
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )

}