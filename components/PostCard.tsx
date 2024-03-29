import Image from 'next/image'
import Link from 'next/link';
import { branchName } from '@/utils/constants';

interface Post {
  post: {
    slug: string,
    frontMatter: any
  }
}

const PostCard = ({ post }: Post) => {
  return (
    <Link href={`/posts/${post.slug}`}>
      <div className='border roounded-lg'>
        <Image
          src={`${branchName}/${post.frontMatter.image}`}
          width={1200}
          height={700}
          alt={post.frontMatter.title}
          // priority={true}
        />
      </div>
      <div className='px-2 py-4'>
        <h1 className='font-bold text-lg'>{ post.frontMatter.title }</h1>
        <span>{ post.frontMatter.date }</span>
      </div>
    </Link>
  )
}

export default PostCard