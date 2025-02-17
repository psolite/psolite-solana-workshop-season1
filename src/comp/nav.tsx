"use client";

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';

const NavBar: React.FC = () => {
    const { publicKey, wallet } = useWallet();

    const handleWalletConnect = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // Trigger WalletMultiButton functionality
        const button = document.querySelector('.wallet-adapter-button') as HTMLButtonElement;
        if (button) {
            button.click();
        }
    };

    return (
        <>
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white text-lg font-bold">
                        Onchain Blog
                    </div>

                    <div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleWalletConnect}>
                            {!publicKey ? "Connect wallet" :
                                <div className="flex">
                                    <Image
                                        src={wallet?.adapter.icon || ''}
                                        alt={wallet?.adapter.name || ''}
                                        height={20}
                                        width={20}
                                        className="mr-2 sm:w-5 w-4"
                                    />
                                    {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}

                                </div>
                            }
                        </button>
                        <WalletMultiButton style={{ display: 'none' }} />
                    </div>
                </div>
            </nav>
            <div className="flex justify-center space-x-4 mt-3">
                <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Home</Link>
                <Link href="/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Create</Link>
                <Link href="/user" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">User Post</Link>
                <Link href="https://x.com/0xpsoliteSol" target='blank' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Contact</Link>
            </div>
        </>
    );
};


export default NavBar;