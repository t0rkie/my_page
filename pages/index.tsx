import { Inter } from 'next/font/google'
import Link from 'next/link'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="favicon.ico" />
      </Head>
      <section>
        <h1>
          Read <Link href="/posts/first-post">this page!</Link>
        </h1>
      </section>
    </>
  )
}
