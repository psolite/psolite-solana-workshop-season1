"use client"

import React, { useState } from 'react';
// import { connection, createPost } from '../anchor/setup';
import { useWallet } from '@solana/wallet-adapter-react';
import { connection, createPost } from '../anchor/setup';
import { Transaction } from '@solana/web3.js';

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { publicKey, sendTransaction } = useWallet();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle post creation logic here
        console.log('Post created:', { title, content });
        await handleCreatePost()
    };

    const handleCreatePost = async () => {

        if (!publicKey) {
            return;
        }
        setLoading(true)
        setMessage('')
        try {
            const Ix = await createPost(publicKey, title, content );

            const transaction = new Transaction().add(Ix);
            
            const tx = await sendTransaction(transaction, connection);
            // Sign and send the transaction
            const confirmation = await connection.confirmTransaction(tx, "confirmed");
            if (!confirmation.value.err) {

                setMessage("Successfully Published");

                return
            }
            setMessage("Transaction not confirmed");
            throw new Error("Transaction not confirmed");
        } catch (e) {
            setMessage((e as Error).message)
            throw new Error((e as Error).message || "Transaction not confirmed");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className=" bg-gray-100 p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Create Post</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content:</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">{loading ? "Uploading.." : "Create Post"}</button>
                    <p>{message}</p>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;