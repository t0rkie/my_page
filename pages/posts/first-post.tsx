import type { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import Layout from '@/components/layout'

const FirstPost: FC = () => {
  return (
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>
      <h1>First Post</h1>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
      <Image
        src="/images/a.png"
        width={144}
        height={144}
        alt="profile"
      />
    </Layout>
  )
}

export default FirstPost