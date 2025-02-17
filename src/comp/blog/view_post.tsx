import Link from 'next/link';
import { Post } from './home';

const ViewPost: React.FC<{ post: Post, user: string }> = ({ post, user }) => {


    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className=" p-8 rounded-lg shadow-md w-full max-w-2xl bg-gray-100">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <p className="text-gray-700 mb-6">{post.content}</p>
                <p className="text-gray-500">Author: {post.author.slice(0, 4)}...{post.author.slice(-4)}</p>
                <p className="text-gray-500">Created At: {new Date(post.createdAt).toLocaleString()}</p>
                <p className="text-gray-500">Last Updated: {new Date(post.updatedAt).toLocaleString()}</p>
                {post.author == user ? <Link href={`/edit/${post.id}`} className="bg-blue-500 text-white px-4 py-2 my-5 mt-10 rounded">Edit Post</Link> : ""}
            </div>
        </div>
    );
};

export default ViewPost;