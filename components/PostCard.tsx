import Link from "next/link";

interface Post {
  post: {
    slug: string,
    frontMatter: any
  }
}

const PostCard = ({ post }: Post) => {
  return (
    <Link href={`/post/${post.slug}`}>
      { post.frontMatter.title }
    </Link>
  )
}

export default PostCard