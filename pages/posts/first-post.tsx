import type { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const FirstPost: FC = () => {
  return (
    <div>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
      <Image
        src="/images/a.png"
        width={144}
        height={144}
        alt="profile"
      />
    </div>
  )
}

export default FirstPost