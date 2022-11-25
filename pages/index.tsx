import type { NextPage } from 'next'
// import Connected from '../components/Connected'
// import Disconnected from '../components/Disconnected'
// import MainLayout from '../components/MainLayout'

import { useWallet } from '@solana/wallet-adapter-react'

import dynamic from 'next/dynamic'

const LayoutDynamic = dynamic(async () => (await import('../components/MainLayout')), {
  ssr: false
})

const ConnectedDynamic = dynamic(async () => (await import('../components/Connected')), {
  ssr: false
})

const DisconnectedDynamic = dynamic(async () => (await import('../components/Disconnected')), {
  ssr: false
})

const Home: NextPage = () => {
  const { connected } = useWallet()

  return <LayoutDynamic>{connected ? <ConnectedDynamic /> : <DisconnectedDynamic />}</LayoutDynamic>
}

export default Home
