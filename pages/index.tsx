import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {sanityClient, urlFor} from '../sanity';
import {Collection} from "../typings";
import React from "react";

interface Props {
    collections: Collection[]
}

// @ts-ignore
const Home: NextPage = ({collections}: Props) => {

    return (
    <div className="max-w-7xl mx-auto flex-col flex min-h-screen py-20 px-10 2xl:px-0">
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="https://venturebeat.com/wp-content/uploads/2022/03/GettyImages-1365200314.jpg?fit=2211%2C1171&strip=all" />
      </Head>

        <header className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-extralight">The <span className="font-extrabold uppercase underline decoration-pink-600/50">Boring Apes</span> NFT Market Place</h1>
        </header>

        <main className="bg-slate-100 p-10 shadow-xl shadow-rose-400/20">
            <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {collections.map(collection => (
                    <div className="flex flex-col items-center hover:cursor-pointer transition-all duration-200 hover:scale-105">
                        <img className="h-96 w-60 rounded-2xl object-cover" src={urlFor(collection.mainImage).url()} alt=""/>
                        <div className="p-5">
                            <h2 className="text-3xl">{collection.title}</h2>
                            <p className="mt-2 text-sm text-gray-400">{collection.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>

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
          nftCollectionName,
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
