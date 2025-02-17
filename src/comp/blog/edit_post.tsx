"use client"

import React, { useState } from 'react';
import { Post } from './home';
import { useWallet } from '@solana/wallet-adapter-react';
// import { connection, deletePost, editPost, setPublish } from '../anchor/setup';

const EditPost: React.FC<{ post: Post }> = ({ post }) => {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { publicKey, sendTransaction } = useWallet()

    const handleToggle = async () => {
        if (!publicKey) {
            return;
        }
        setLoading(true)
        setMessage('')
        try {
            // const transaction = await setPublish(post.id, publicKey.toBase58());
            // const tx = await sendTransaction(transaction, connection);
            // // Sign and send the transaction
            // const confirmation = await connection.confirmTransaction(tx, "confirmed");
            // if (!confirmation.value.err) {
            //     setMessage("Successfully Edited");
            //     return
            // }
            setMessage("Transaction not confirmed");
            throw new Error("Transaction not confirmed");
        } catch (e) {
            setMessage((e as Error).message)
            throw new Error((e as Error).message || "Transaction not confirmed");
        } finally {
            setLoading(false)
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle post creation logic here
        await handleEditPost()
    };

    const handleEditPost = async () => {
        if (!publicKey) {
            return;
        }
        setLoading(true)
        setMessage('')
        try {
            // const transaction = await editPost(title, content, post.id, publicKey.toBase58());
            // const tx = await sendTransaction(transaction, connection);
            // // Sign and send the transaction
            // const confirmation = await connection.confirmTransaction(tx, "confirmed");
            // if (!confirmation.value.err) {

            //     setMessage("Successfully Edited");

            //     return
            // }
            setMessage("Transaction not confirmed");
            throw new Error("Transaction not confirmed");
        } catch (e) {
            setMessage((e as Error).message)
            throw new Error((e as Error).message || "Transaction not confirmed");
        } finally {
            setLoading(false)
        }
    }

    const handleDeletePost = async () => {
        setLoading(true)
        setMessage('')
        try {
            if (!publicKey) {
                return;
            }
            // const transaction = await deletePost(post.id, publicKey.toBase58());
            // const tx = await sendTransaction(transaction, connection);
            // // Sign and send the transaction
            // const confirmation = await connection.confirmTransaction(tx, "confirmed");
            // if (!confirmation.value.err) {

            //     setMessage("Successfully Deleted");

            //     return
            // }
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
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className=" p-8 rounded shadow-md w-full max-w-md bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 w-full max-w-md">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Title:
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </label>
                    </div>
                    <div className="mb-4 w-full max-w-md">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Content:
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </label>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" disabled={loading || post.author !== publicKey?.toBase58()}>{loading ? "Loading.." : "Edit Post"}</button>
                    <p>{message}</p>
                </form>
                <div className='flex mt-10 space-x-4'>
                    <button onClick={handleDeletePost} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" disabled={loading || post.author !== publicKey?.toBase58()}>
                        {loading ? "Loading.." : "Delete Post"}
                    </button>
                    <button onClick={handleToggle} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" disabled={loading || post.author !== publicKey?.toBase58()}>
                        {loading ? "Loading.." : post.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPost;