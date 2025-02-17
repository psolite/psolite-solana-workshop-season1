"use client"

// import { getOnePost } from '@/components/anchor/setup';
import { Post } from '@/comp/blog/home';
import ViewPost from '@/comp/blog/view_post';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PostPage: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const { pda } = useParams<{ pda: string }>();
    const {publicKey} = useWallet()
    
    useEffect(() => {
        // Replace with your actual API call
        const fetchPost = async () => {
            try {
                // const response: Post = await getOnePost(pda);
                // setPost(response);
            } catch (error) {
                console.error('Failed to fetch post:', error);
            }
        };

        fetchPost();
    }, [pda]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
       <ViewPost post={post} user={publicKey?.toBase58() || ''} />
    );
};

export default PostPage;