import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from "next/head";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

function MyApp({ Component, pageProps }: AppProps) {
  return(
      <>
          <ThirdwebProvider desiredChainId={ChainId.Mainnet}>
              <Head>
                  <title>NFT Drop</title>
                  <link rel="icon" href="https://venturebeat.com/wp-content/uploads/2022/03/GettyImages-1365200314.jpg?fit=2211%2C1171&strip=all" />
              </Head>
              <Component {...pageProps} />
          </ThirdwebProvider>
      </>
  )
}

export default MyApp
