"use client"

// import { getOnePost } from "@/components/anchor/setup";
import EditPost from "@/comp/blog/edit_post";
import { Post } from "@/comp/blog/home";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Edit() {
  const [post, setPost] = useState<Post | null>(null);
    const { pda } = useParams<{ pda: string }>();
    
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
    <EditPost post={post} />
  );
}
