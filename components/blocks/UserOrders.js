import BaseApi from '@/lib/api/_base.api';
import persistentStore from '@/lib/store/persistentStore';
import { useCallback, useEffect, useState } from 'react';
import AccordionItem from '../misc/AccordionItem';
export default function UserOrders() {
    const profile = persistentStore((state) => state.profile); 
    const [orders, setOrders] = useState([]);

    const fetchOrders = useCallback(async() => {
        try {
            const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + `/user/${profile.user_id}/orders`);
            setOrders(res.data.data); 
        }catch(error) {
            console.log('Error', error);
        }
    }, [])

    useEffect(() => {
        fetchOrders(); 
    }, [])

    return(
        <div>
            {orders.length > 0 ? (
                <>
                    {orders.map((item, index) => (
                        <AccordionItem color="#1a1a1a" item={item} key={index} />
                    ))}
                </>
            ) : (
                <>
                    <div className="flex flex-col text-[20px] font-bold py-[30px] items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[150px] h-[150px]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                        </svg>
                        No results found.
                    </div>
                </>
            )}
            
        </div>
    )
}