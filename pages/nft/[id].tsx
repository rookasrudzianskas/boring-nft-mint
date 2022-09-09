import React from 'react';
import Image from "next/image";
import Head from "next/head";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";


const NFTDropPage = () => {
    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();

    return (
        <div>
            <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
                <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
                    <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
                        <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
                            <img className="w-44 rounded-xl object-cover lg:h-96 lg:w-72" src="https://links.papareact.com/8sg" alt="" />
                        </div>
                        <div className="text-center p-5 space-y-2">
                            <h1 className="text-4xl font-bold text-white">Boring Apes</h1>
                            <h2 className="text-xl text-gray-300">A collection of Boring Apes who live & breath in React</h2>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-12 lg:col-span-6">
                    <header className="flex items-center justify-between">
                        <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">The <span className="font-extrabold uppercase underline decoration-pink-600/50">Boring Apes</span> NFT Market Place</h1>
                        <button onClick={() => address ? disconnect() : connectWithMetamask()} className="rounded-full bg-rose-400 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base">{address ? 'Sign Out' : 'Sign In'}</button>
                    </header>

                    <hr className="my-2 border"/>

                    <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
                        <img src="https://links.papareact.com/bdy" className="w-80 object-cover pb-10 lg:h-40" alt=""/>
                        <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">The <span className="uppercase">Boring Apes</span> Coding Club | NFT Drop</h1>
                        <p className="pt-2 text-xl text-green-500">13 / 21 NFT's claimed</p>
                    </div>

                    <button className="h-16 w-full bg-red-600 text-white rounded-full mt-10 font-bold hover:bg-opacity-80 duration-150">
                        Mint NFT (0.1 ETH)
                    </button>

                </div>
            </div>
        </div>
    );
};

export default NFTDropPage;
