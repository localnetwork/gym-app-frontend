import helper from "@/lib/scrap/helper";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import modalState from "@/lib/store/modalState";

export default function AccordionItem({ item }) {
    const [isOpen, setIsOpen] = useState(false);
    let statusBgClass;

    if(item?.order_status === "completed") {
        statusBgClass = "bg-green-500";
    }else if(item?.order_status === "cancelled") {
        statusBgClass = "bg-red-500";
    }else {
        statusBgClass = "bg-[#aaa]";
    }
    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        setIsOpen(false);
    }, [item]);
    

    const payment_method = item?.payment_gateway.toLowerCase();

    return(
        <div className="mb-3">
            <div onClick={toggleAccordion} className="accordion-header select-none cursor-pointer flex justify-between bg-[#121212] p-[15px] text-[20px] font-bold text-white">
                <span>
                    Order #{item?.order_id}
                    <span className={`px-[10px] ml-[15px] text-[14px] rounded-[5px] pb-[2px] text-black inline-block ${statusBgClass}`}>{item?.order_status}</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 transition ${isOpen ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>

            {isOpen && (
                <div className="bg-[#dcdcdc] p-[15px] min-h-[150px]">
                    <h2 className="font-bold text-[15px] mb-2">Order Information</h2>
                    <div>
                        Ordered by: {item?.availed_by}
                    </div>
                    <div className="mb-2"> 
                        Ordered On: {item?.created}
                        {/* Ordered On: {{helper.dateFormatter()}} */}
                    </div>
                    
                    {item?.order_status === "completed" && (
                        <div className="mb-2">
                            {item?.subscription_date == 0 ? (
                                <>
                                    <span className="text-green-700 font-bold">
                                        No expiration for Lifetime subscription.
                                    </span>
                                </>
                            ) : (
                                <>
                                    Expected Expiration Date: 
                                    <span className="underline">
                                        {helper.dateFormatter(item?.subscription_date)}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                    
                    <table className="w-full order-detail-table">
                        <thead>
                            <tr className="bg-[#afafaf]">
                                <th className="py-[5px] border-r-[1px] border-[#ccc]">Availed Promo</th>
                                <th className="py-[5px] border-r-[1px] border-[#ccc]">Price</th>
                                <th className="py-[5px] border-r-[1px] border-[#ccc]">Status</th>
                                <th className="py-[5px] border-r-[1px] border-[#ccc]">Payment Method</th>
                                {item?.proof && (
                                    <th className="py-[5px] border-r-[1px] border-[#ccc]">Proof</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <tr className="text-center">
                                <td className="p-[15px]">{item?.promo_title}</td>
                                <td className="p-[15px]">{helper.priceFormatter(item?.promo_price)}</td>
                                <td className="p-[15px]">
                                    <span className={`text-black px-[15px] py-[5px] rounded-[5px] ${item.status || item?.order_status === "pending" ? 'bg-red-500' : 'bg-green-500'}`}>
                                        {item?.order_status === "pending" ? (
                                            <>
                                                inactive
                                            </>
                                        ): (
                                            <>
                                                {item.status ? 'expired' : 'active'}
                                            </>
                                        
                                        )}
                                    </span>
                                </td>
                                <td className="p-[15px]">{item?.payment_gateway}</td>
                                {item?.proof && (
                                    <td className="p-[15px]">
                                        <Link className="inline-block hover:opacity-50" target="_blank" href={process.env.NEXT_PUBLIC_API_URL + item.proof}>
                                            <Image className="object-cover" src={process.env.NEXT_PUBLIC_API_URL + item.proof} alt="Proof" width={150} height={150} />
                                        </Link>
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                            
                            
                    {item?.order_status === "pending" && payment_method !== 'paypal' && (
                        <>
                            <div className="flex gap-x-[15px]"> 
                                <div onClick={
                                        () => { 
                                        modalState.setState({ modalOpen: true, editInfo: { id: item.order_id }, modalInfo: { id: "approve-order", title: `Are you sure you want to approve Order #${item.order_id} ?` } });
                                        }
                                    } className="inline-flex mt-5 max-w-[150px] px-[10px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-green-500 py-[10px] text-black text-uppercase w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                    </svg>
                                    Approve
                                </div>
                                <div onClick={
                                        () => { 
                                        modalState.setState({ modalOpen: true, editInfo: { id: item.order_id }, modalInfo: { id: "cancel-order", title: `Are you sure you want to cancel Order #${item.order_id} ?` } });
                                        }
                                    }  className="inline-flex mt-5 max-w-[150px] px-[10px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-red-500 py-[10px] text-black text-uppercase w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                    Cancel
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}