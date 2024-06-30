import helper from '@/lib/scrap/helper';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
export default function UserInfo() {
    const router = useRouter();
    const [publicProfile, setPublicProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        
        const getPublicProfile = async() => {
            setIsLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/public/${router?.query?.id}`);
                if(res.status === 200) {
                    const data = await res.json();
                    setIsLoading(false);
                    setPublicProfile(data);
                }
            } catch (error) {
                setIsLoading(false);
                console.error('Error', error)
            }
        }

        if(router?.query?.id) {
            getPublicProfile(); 
        }
    }, [router?.query?.id])
     
    return (
        <div className="py-[30px] px-[15px]">
            <Head>
            <title>
                {publicProfile?.name ? publicProfile?.name : "Loading..."} 
            </title>
            </Head>
            <div className="container">
                <div className="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]"> 
                        {isLoading ? (
                            <p>Loading... Please wait.</p>
                        ) : (
                            <div>
                                <h1 className='text-[40px] font-black text-black'>{publicProfile?.name}</h1>
                                {publicProfile?.subscription?.status === "lifetime" ? (
                                    <span className='bg-green-500 py-[5px] px-[30px] rounded-[15px] inline-block mt-[15px]'>Lifetime</span>
                                ) : (
                                    <span className={`bg-green-500 ${publicProfile?.subscription?.totalDays === 0 ? 'bg-red-600' : ''} py-[5px] px-[30px] rounded-[15px] inline-block mt-[15px]`}>
                                        {publicProfile?.subscription?.totalDays === 0 ? "Ended" : publicProfile?.subscription?.totalDays + " days left"}
                                    </span>
                                )}
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}