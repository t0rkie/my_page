import fs from 'fs'
import matter from 'gray-matter'
import { branchName } from '@/utils/constants';
import { unified } from 'unified'
import { toc } from 'mdast-util-toc'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeParse from 'rehype-parse/lib'
import rehypeReact from 'rehype-react/lib'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import remarkPrism from 'remark-prism'
import { createElement, Fragment } from 'react'
import Link from 'next/link'

interface Params {
  params: {
    slug: String
    frontMatter: any
  }
}

interface Props {
  frontMatter: any
  content: any,
  toc: any,
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
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)

  // TODO: サイドバーに目次表示
  const toc = await unified()
    .use(remarkParse)
    .use(getToc, {
      heading: '目次',
      tight: true,
    })
    // @ts-ignore
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content)

  return {
    props: {
      frontMatter: data,
      content: result.toString(),
      toc: toc.toString(),
      slug: params.slug
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

const Post = ({ frontMatter, content, toc, slug }: Props) => {
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
            src={`${branchName}/${frontMatter.image}`}
            width={1200}
            height={700}
            alt={frontMatter.title}
            // priority={false}
          />
        </div>
        <h1 className='mt-12'>{ frontMatter.title }</h1>
        <span>{ frontMatter.date }</span>
        <div className='space-x-2'>
          {frontMatter.categories.map((category: any) => (
            <span key={category}>
              <span key={category}>
                <Link href={`/categories/${category}`}>
                  {category}
                </Link>
              </span>
            </span>
          ))}
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-9">{toReactNode(content)}</div>
          <div className="col-span-3">
            <div
              className="sticky top-[50px]"
              dangerouslySetInnerHTML={{ __html: toc }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const toReactNode = (content: any) => {
  return unified()
    .use(rehypeParse, {
      fragment: true,
    })
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {
        a: MyLink,
        img: MyImage
      }
    })
    .processSync(content).result
}

const MyLink = ({ children, href }: any) => {
  if (href === '') href='/'

  return href.startsWith('/') || href.startsWith('#') ? (
    <Link href={href}>
      { children }
    </Link>
  ) : (
    <a href={href} target='_blank' rel='noopener noreferrer'>
      { children }
    </a>
  )
}

const MyImage = ({ src, alt, ...props }: any) => {
  return <Image src={src} alt={alt} {...props} />
}

// @ts-ignore
const getToc = (options) => {
  // @ts-ignore
  return (node) => {
    const result = toc(node, options)
    node.children = [result.map]
  }
}

export default Post