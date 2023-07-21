import fs from 'fs'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import remakrkPrism from 'remark-prism'
import remarkPrism from 'remark-prism'

interface Params {
  params: {
    slug: String
    frontMatter: any
  }
}

interface Props {
  frontMatter: any
  content: any,
  slug: String
}

export async function getStaticProps({ params }: Params) {
  const file = fs.readFileSync(`posts/${params.slug}.md`, 'utf-8')
  const { data, content } = matter(file)

  const result = await unified()
    .use(remarkParse)
    .use(remarkPrism, {
      /* options */
      plugins: ['line-numbers']
    })
    .use(remarkToc, {
      heading: '目次'
    })
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content)

  return {
    props: {
      frontMatter: data,
      content: result.toString()
    }
  }
}

export async function getStaticPaths() {
  const files = fs.readdirSync('posts')
  const paths = files.map(fileName => ({
    params: {
      slug: fileName.replace(/\.md$/, '')
    }
  }))
  return {
    paths,
    fallback: false,
  }
}

const Post = ({ frontMatter, content, slug }: Props) => {
  return (
    <>
      <NextSeo
        title={frontMatter.title}
        description={frontMatter.description}
        openGraph={{
          type: 'website',
          url: `http:localhost:3000/posts/${slug}`,
          title: frontMatter.title,
          description: frontMatter.description,
          images: [
            {
              url: `https://localhost:3000/${frontMatter.image}`,
              width: 1200,
              height: 700,
              alt: frontMatter.title,
            }
          ]
        }}
      />
      <div className='prose prose-lg max-w-none'>
        <div className='border'>
          <Image
            src={`/${frontMatter.image}`}
            width={1200}
            height={700}
            alt={frontMatter.title}
            // priority={false}
          />
        </div>
        <h1 className='mt-12'>{ frontMatter.title }</h1>
        <span>{ frontMatter.date }</span>
        <div dangerouslySetInnerHTML={{ __html: content }} ></div>
      </div>
    </>
  )
}

export default Post