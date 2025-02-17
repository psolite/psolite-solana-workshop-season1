import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { BN, Program, web3 } from "@coral-xyz/anchor";
import idl from "./idl.json";
import { OnchainBlog } from "./blog";
import exp from "constants";
import { Post } from "../blog/home";

export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const program = new Program(idl as OnchainBlog, {
    connection,
});

export const createPost = async (user: PublicKey, title: string, content: string) => {

    const timestamp = new BN(Date.now());
    const timestampBuffer = timestamp.toArrayLike(Buffer, 'le', 8);

    const [postPda, bump] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("psolite"), user.toBuffer(), timestampBuffer],
        program.programId
    );

    const postContext = {
        post: postPda,
        author: user,
        systemProgram: web3.SystemProgram.programId,
    }

    const Ix = await program.methods.createPost(title, content, timestamp).
        accounts(postContext)
        .instruction()

    return Ix;
}

export const getPosts = async () => {
    const post = await program.account.post.all();
    const posts: Post[] = [];

    for (const p of post) {
        posts.push({
            id: p.publicKey.toBase58(),
            title: p.account.title,
            content: p.account.content,
            author: p.account.author.toBase58(),
            createdAt: p.account.createdAt.toNumber(),
            updatedAt: p.account.updatedAt.toNumber(),
            isPublished: p.account.isPublished
        })
    }
    return posts;
}