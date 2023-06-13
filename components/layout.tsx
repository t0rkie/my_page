import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className='container'>
      { children }
    </div>
  )
}

export default Layout