import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import MainLayout from '../components/MainLayout'
import { Container, Heading, VStack, Text, Image, Button, HStack } from '@chakra-ui/react'
import { MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { PublicKey, Transaction } from '@solana/web3.js'
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'

const NewMint: NextPage<NewMintProps> = ({ mint }) => {
  const [nftData, setNftData] = useState<any>()
  const { connection } = useConnection()
  const walletAdapter = useWallet()
  const { publicKey, sendTransaction } = useWallet()
  const [hasMounted, setHasMounted] = useState(false);

  // metaplex setup
  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
  }, [connection, walletAdapter])
  const router = useRouter()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(async () => {
    if (publicKey) {
      // get token account of NFT
      const tokenAccount = (await connection.getTokenLargestAccounts(mint)).value[0].address

      console.log(tokenAccount)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, mint, nftData])

  useEffect(() => {
    metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(mint) })
      .run()
      .then(nft => {
        setNftData(nft)
      })
  }, [mint, metaplex])

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <MainLayout>
      <VStack spacing={20}>
        <Container>
          <VStack spacing={8}>
            <Heading color='white' as='h1' size='2xl' textAlign='center'>
              😮 A new buildoor has appeared!
            </Heading>

            <Text color='bodyText' fontSize='xl' textAlign='center'>
              Congratulations, you minted a lvl 1 buildoor! <br />
              Time to stake your character to earn rewards and level up.
            </Text>
          </VStack>
        </Container>

        <Image src={nftData?.json.image ?? ''} alt='' />

        <Button bgColor='accent' color='white' maxW='380px' onClick={handleClick}>
          <HStack>
            <Text>stake my buildoor</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </VStack>
    </MainLayout>
  )
}

interface NewMintProps {
  mint: PublicKey
}

NewMint.getInitialProps = async ({ query }) => {
  const { mint } = query

  if (!mint) throw { error: 'no mint' }

  try {
    const mintPubkey = new PublicKey(mint)
    return { mint: mintPubkey }
  } catch {
    throw { error: 'invalid mint' }
  }
}

export default NewMint
