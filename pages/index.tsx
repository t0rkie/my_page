import fs from 'fs'
import matter from 'gray-matter'
import PostCard from '@/components/PostCard'

interface Post {
  slug: string
  frontMatter: any
}

interface HomeProps {
  posts: Post[];
}

export const getStaticProps = () => {
  const files = fs.readdirSync('posts')
  const posts = files.map(fileName => {
    const slug = fileName.replace(/\.md$/, '')
    const fileContent = fs.readFileSync(`posts/${fileName}`, 'utf-8')
    const { data } = matter(fileContent)

    return {
      frontMatter: data,
      slug
    }
  })
  return {
    props: {
      posts
    }
  }
}

export default function Home({ posts }: HomeProps) {
  return (
    <div className='my-8'>
      <div className='grid grid-cols-3'>
        { posts.map(post => (
          <PostCard key={post.slug} post={post} />
          ))
        }
      </div>
    </div>
  )
}
