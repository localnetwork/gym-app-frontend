import BaseApi from "@/lib/api/_base.api";
import helper from "@/lib/scrap/helper";
import modalState from "@/lib/store/modalState";
import { useEffect, useState } from "react";

export default function ViewUserSubscriptions() {
    const [loading, setIsLoading] = useState(true); 
    const { modalOpen, modalInfo, setModalInfo, editInfo, clearModal } = modalState((state) => ({
        modalOpen: state.modalOpen,
        modalInfo: state.modalInfo,
        setModalInfo: state.setModalInfo,
        clearModal: state.clearModal,
        editInfo: state.editInfo,
    }));  
    const [subscriptions, setSubscriptions] = useState([]); 

    useEffect(() => {
        const fetchSubscriptions = async() => {
            setIsLoading(true); 
            try {
                const res = await BaseApi.get(process.env.NEXT_PUBLIC_API_URL + "/users/public/" + modalInfo.memberId);
                setSubscriptions(res?.data?.subscription?.subscriptions)
                setIsLoading(false); 
            }catch(error) { 
                console.error('Error: ', error)
            }
        }

        fetchSubscriptions();
    }, [])
    return(
        <div>
            {!loading ? (
                <>
                    {subscriptions?.length > 0 ? (
                        <>
                            <div>
                                <div className="flex justify-between items-center gap-x-[15px] font-bold mb-[15px]">
                                    <div className="w-full max-w-[33.33%]">
                                        Created
                                    </div>
                                    <div className="w-full max-w-[33.33%]">
                                        Plan Purchased
                                    </div>
                                    <div className="w-full max-w-[33.33%]">
                                        Duration
                                    </div>
                                    <div className="w-full max-w-[33.33%]">
                                        Status
                                    </div>
                                </div>

                            </div>
                            {subscriptions?.map((item, index) => (
                                <div key={index} className="bg-[#f5f5f5] px-[15px] text-[14px] mb-[15px] flex py-[30px] border-b-[1px] border-[#ccc] gap-x-[15px]">
                                    <div className="w-full max-w-[33.33%]">
                                        {item?.created}
                                    </div>
                                    <div className="w-full max-w-[33.33%]">
                                        {item?.promoTitle}
                                    </div>

                                    <div className="w-full max-w-[33.33%]">
                                        {item?.duration}
                                    </div>

                                    <div className="w-full max-w-[33.33%]">
                                        <span className={`py-[5px] px-[30px] rounded-[15px] inline-block mt-[15px] ${item?.expired ? 'bg-red-500' : 'bg-green-500'}`}>
                                        {item?.expired ? 'Expired' : 'Active'}
                                        </span>
                                    </div>
                                </div> 
                            ))}
                        </>
                    ): (
                        <div>
                            {`This user has not purchased any subscriptions yet.`}
                        </div>
                    )}
                </>
            ) : (
                <>
                    Loading...
                </>
            )}
            
        </div>
    )
}