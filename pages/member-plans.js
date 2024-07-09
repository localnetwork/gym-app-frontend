
import BaseApi from "@/lib/api/_base.api";
import { useEffect, useState } from "react";


import { Montserrat } from "next/font/google";
// If loading a variable font, you don't need to specify the font weight
const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

import modalState from "@/lib/store/modalState";
import entityState from "@/lib/store/modalState";
import AddPromo from "@/components/forms/AddPromo";  
import useEntityState from "@/lib/store/entityState"; 
import persistentStore from "@/lib/store/persistentStore";
import Page403 from "@/components/statuses/Page403";
import Head from "next/head";
import helper from "@/lib/scrap/helper";
export default function Promos() {
  const [loading, setLoading] = useState(true);
  const profile = persistentStore((state) => state.profile);
  const { modalOpen, modalInfo, setModalInfo } = modalState((state) => ({
    modalOpen: state.modalOpen,
    modalInfo: state.modalInfo,
    setModalInfo: state.setModalInfo,
  })); 


//   publicPromos: [],
//     isPublicPromosLoading: true, 
//     refetchPublicPromos

  const { publicPromos, isPublicPromosLoading, refetchPublicPromos } = useEntityState((state) => ({
    publicPromos: state.publicPromos,
    isPublicPromosLoading: state.isPublicPromosLoading,
    refetchPublicPromos: state.refetchPublicPromos,
  }));


  useEffect(() => {
    refetchPublicPromos(); 
}, [refetchPublicPromos]);


//   if(profile?.role !== 1) {
//     return <Page403 />
//   }

  if(!profile) {
    return <Page403 />
  }

  const priceFormatter = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP", 
    }).format(price);
  } 

  if(profile) {
    return (
      <div className="py-[30px]">
        <Head>
          <title>
          Promos
          </title>
        </Head>
        <div className="container">
          <div className="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]">
            <div className="flex flex-wrap items-center justify-between gap-[15px] mb-[30px]">
              <h1
                className={`text-[40px] font-black text-black ${montserrat.className}`}
              >
                Promos
              </h1>
            </div> 
  
            {isPublicPromosLoading ? (
              <div>
                {Array.from({ length: 8 }, (_, index) => (
                  <div key={index} className="animate-pulse flex space-x-4">
                    <div className="rounded-lg bg-gray-300 h-12 w-12"></div>
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div> 
                {publicPromos?.length === 0 && (
                  <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[150px]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                    </svg>
                    <h2 className="text-xl font-bold">No plans available at the moment. Please try again later.</h2>
                  </div>  
                )} 
                {publicPromos?.map((promo, index) => (
                  <div key={index} className="mb-4 bg-[#fff] p-[30px]">
                    <h2 className="text-xl font-bold mb-2">{promo.title}</h2>

                    {promo.price && (
                      <div className="flex gap-[15px]">
                        <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                        </svg>
                        {priceFormatter(promo.price)}
                        </div>

                        
                        <div>
                            {promo.duration && (
                              <div className="flex gap-[5px]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                                {promo.membership_months > 0 ? `${helper.daysFormatter(promo.membership_months)}` : "Lifetime"}
                              </div>
                            )} 
                          </div>
                      </div>
                    )}


                    <div className="inline-flex max-w-[220px] mt-[15px] px-[30px] items-center justify-center hover:bg-green-600 text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-green-500 py-[10px] text-black text-uppercase w-full" onClick={() => {
                      setModalInfo({ id: "checkout-modal", title: `Checkout`, promo: promo });
                      modalState.setState({ modalOpen: true });
                    }}>
                      Checkout
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
