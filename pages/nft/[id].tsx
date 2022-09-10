import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Head from "next/head";
import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import {GetServerSideProps} from "next";
import {sanityClient, urlFor} from "../../sanity";
import {Collection} from "../../typings";
import Link from "next/link";
import {BigNumber} from "ethers";
import toast, { Toaster } from 'react-hot-toast';

interface Props {
    collections: Collection
}


const NFTDropPage = ({collections}: Props) => {
    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();
    const [claimedSupply, setClaimedSupply] = useState<number>(0);
    const [totalSupply, setTotalSupply] = useState<BigNumber>();
    const nftDrop = useNFTDrop(collections.address);
    const [loading, setLoading] = useState<boolean>(false);
    const [priceInEth, setPriceInEth] = useState<string>();

    useEffect(() => {
        // console.log(nftDrop);
        if(!nftDrop) return;
        // console.log('it goes here')
        const fetchNFTDropData = async () => {
            setLoading(true);
            // @ts-ignore
            const claimed = await nftDrop.getAllClaimed();
            // console.log(claimed, 'This is claimed');
            // @ts-ignore
            const total = await nftDrop.totalSupply();

            setClaimedSupply(claimed.length);
            setTotalSupply(total);
            setLoading(false);
        }
        fetchNFTDropData();
    }, [nftDrop]);

    useEffect(() => {
        if(!nftDrop) return;
        const fetchPrice = async () => {
            const claimConditions = await nftDrop.claimConditions.getAll();
            setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue);
            // console.log(claimConditions?.[0].currencyMetadata.displayValue, 'This is the price');
        }
        fetchPrice();
    }, [nftDrop]);

    const mintNft =  () => {
        if(!nftDrop || !address) return;
        const quantity = 1;
        setLoading(true);
        const notification = toast.loading('Minting NFT...', {
            style: {
                background: 'white',
                color: 'green',
                fontWeight: 'bolder',
                fontSize: '17px',
                padding: '20px',
            }
        });
        nftDrop.claimTo(address, quantity).then(async (tx) => {
            const receipt = tx[0].receipt; // the transaction receipt
            const claimedTokenId = tx[0].id // the id of the NFT claimed
            const claimedNFT = await tx[0].data() // the claimed NFT data

            toast('NFT Minted!', {
                duration: 8000,
                style: {
                    background: 'green',
                    color: 'white',
                    fontWeight: 'bolder',
                    fontSize: '17px',
                    padding: '20px',
                }
            });

            console.log(receipt, 'This is the receipt');
            console.log(claimedTokenId, 'This is the claimed token id');
            console.log(claimedNFT, 'This is the claimed NFT');

        }).catch((err) => {
            console.log(err, 'This is the error');
            toast('Whoops... Error Minting NFT', {
                style: {
                    background: 'red',
                    color: 'white',
                    fontWeight: 'bolder',
                    fontSize: '17px',
                    padding: '20px',
                }
            });
        }).finally(() => {
            // console.log('This is the finally');
            setLoading(false);
            toast.dismiss(notification);
        })
    }

    return (
        <div>
            <Toaster position={'bottom-center'} />
            <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
                <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
                    <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
                        <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
                            <img className="w-44 rounded-xl object-cover lg:h-96 lg:w-72" src={urlFor(collections.previewImage).url()} alt="" />
                        </div>
                        <div className="text-center p-5 space-y-2">
                            <h1 className="text-4xl font-bold text-white">{collections.nftCollectionName}</h1>
                            <h2 className="text-xl text-gray-300">{collections.description}</h2>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-12 lg:col-span-6">
                    <header className="flex items-center justify-between">
                        <Link href={'/'}>
                            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">The <span className="font-extrabold uppercase underline decoration-pink-600/50">Boring Apes</span> NFT Market Place</h1>
                        </Link>
                        <button onClick={() => address ? disconnect() : connectWithMetamask()} className="rounded-full bg-rose-400 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base">{address ? 'Sign Out' : 'Sign In'}</button>
                    </header>

                    <hr className="my-2 border"/>
                    {address && (
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <p className="text-sm text-rose-400">You're logged in with wallet {address.substring(0, 5)}...{address.substring(address.length-5)}</p>
                        </div>
                    )}

                    <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
                        <img src={urlFor(collections.mainImage).url()} className="w-80 object-cover pb-10 lg:h-40" alt=""/>
                        <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold"><span>{collections.title}</span></h1>
                        {loading ? (
                            <p className="pt-2 text-xl text-green-500 animate-pulse">Loading Supply Count...</p>
                        ) : (
                            <p className="pt-2 text-xl text-green-500">{claimedSupply} / {totalSupply?.toString()} NFT's claimed</p>
                        )}
                        {loading && (
                            <img className="h-36 w-36 object-contain" src={'https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif'} alt=""/>
                        )}
                    </div>

                    <button onClick={mintNft} disabled={loading || claimedSupply === totalSupply?.toNumber() || !address} className="h-16 w-full bg-red-600 text-white rounded-full mt-10 font-bold hover:bg-opacity-80 duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {loading ? (
                            <>Loading...</>
                        ) : claimedSupply === totalSupply?.toNumber() ? (
                            <>SOLD OUT </>
                        ) : !address ? (
                            <>Sign in to Mint</>
                        ) : (
                            <span className="font-bold">Mint NFT ({priceInEth} ETH)</span>
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default NFTDropPage;


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const query = `
        *[_type == "collection" && slug.current == $id][0] {
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
    const collections = await sanityClient.fetch(query, {
        id: params?.id
    });

    if(!collections) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            collections
        }
    }
}
