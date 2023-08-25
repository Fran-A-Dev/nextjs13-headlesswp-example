import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";

async function getPosts() {
  const query = `
  {
    posts(first: 5) {
      nodes {
        title
        content
        databaseId
      }
    }
  }
    `;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}?query=${encodeURIComponent(
      query
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 0, //using 0 opts out of cache and re-fetches on every request
      },
    }
  );

  const { data } = await res.json();

  return data.posts.nodes;
}

export default async function PostList() {
  const posts = await getPosts();

  return (
    <>
      {posts.map((post) => (
        <div key={post.databaseId} className="card">
          <Suspense fallback={<Loading />}>
            <Link href={`/post/${post.databaseId}`}>
              <h3>{post.title}</h3>
              <p
                dangerouslySetInnerHTML={{
                  __html: post.content.slice(0, 200) + "...",
                }}
              />
            </Link>
          </Suspense>
        </div>
      ))}
    </>
  );
}