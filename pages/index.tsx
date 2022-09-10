import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {sanityClient, urlFor} from '../sanity';

interface Props {
    collections: Collection[]
}

const Home: NextPage = ({collections}: Props) => {
    console.log(collections, 'This is collections view!');

    return (
    <div className="">
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="https://venturebeat.com/wp-content/uploads/2022/03/GettyImages-1365200314.jpg?fit=2211%2C1171&strip=all" />
      </Head>

    </div>
  )
}

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
    const query = `
        *[_type == "collection"] {
          _id,
          title,
          address,
          description,
          nftCollectioName,
            mainImage {
                asset
        },
            previewImage {
                asset
        },
        slug {
          current
        },
        creator -> {
          _id,
          name,
          address,
          slug {
          current
            },
        },
}`;
    const collections = await sanityClient.fetch(query);
    return {
        props: {
            collections
        }
    }
}
