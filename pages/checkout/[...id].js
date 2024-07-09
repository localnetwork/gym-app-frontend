import BaseApi from "@/lib/api/_base.api";
import axios from "axios";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { Montserrat } from "next/font/google";
import persistentStore from "@/lib/store/persistentStore";  
import Page404 from "@/components/statuses/Page404";
import authService from "@/lib/services/authService";
// If loading a variable font, you don't need to specify the font weight
const montserrat = Montserrat({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
}); 
export default function Checkout() {
    const router = useRouter();
    const [orderInfo, setOrderInfo] = useState({});
    const [isPageNotFound, setIsPageNotFound] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const profile = persistentStore((state) => state.profile);  

    const executePayment = async () => {
        const { token, id, paymentId, PayerID } = router.query;
        const orderId = parseInt(id[0]); 
        try {
            const response = await BaseApi.post(process.env.NEXT_PUBLIC_API_URL + "/checkout/execute", {
                token,
                orderId, 
                paymentId,
                PayerID
            }); 
            
            setOrderInfo(response.data);
        }catch(error) {
        }
    }

    const getOrderInfo = async () => {  
        try {
            const response = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/checkout/" + router.query.id);
            setOrderInfo(response.data);
            setIsPageNotFound(false);
        }catch(error) {
            console.log('Error', error);
            setIsPageNotFound(true);
        }
    }

    useEffect(() => {
        if (Object.keys(router.query).length > 0 && router.query.token && router.query.id && router.query.paymentId && router.query.PayerID) {
            executePayment();
        }  
        getOrderInfo(); 
        setIsLoaded(true);
    }, [router])


    if(!isLoaded) {
        return <div>Loading....</div>;
    }  
    if(isLoaded && isPageNotFound) {
        return <Page404 />
    }

    return(
        <div className="py-[30px]">
            <div className="container">
                <div className="bg-[#EFF0F0] text-[#121212] p-[50px] rounded-[15px]">
                        <div className="flex justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[150px] h-[150px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>

                        </div>
                        <h1 className={`text-center text-[30px] font-black text-black ${montserrat.className}`}>
                            Thank you for your order.
                        </h1>

                        <p className="text-center text-[20px] mt-[15px] font-bold">
                            Order <span className="text-[#009CFF]">#{router?.query?.id || orderInfo?.data?.subscription_id}</span> has been processed successfully.
                        </p>
                        
                        <p className="text-center mt-[15px]">
                            The invoice has been sent to your email. Please check your inbox or spam.
                        </p>
                </div>
            </div>
        </div>
    )
}