import BaseApi from "@/lib/api/_base.api";
import useEntityState from "@/lib/store/entityState";
import modalState from "@/lib/store/modalState";
import { useCallback } from "react";
import { toast } from "react-toastify";

export default function RejectOrder() {
    const { editInfo, modalInfo, setModalInfo, modalOpen, setClearModal } = modalState((state) => ({
        editInfo: state.editInfo,
        modalInfo: state.modalInfo,
        setModalInfo: state.setModalInfo,
        modalOpen: state.modalOpen,
        setClearModal: state.setClearModal,
    }));

    const { refetchOrders } = useEntityState((state) => ({
        refetchOrders: state.refetchOrders,
    }))

    const onYes = useCallback(async () => {
        try {
            const res = await BaseApi.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${editInfo.id}/reject`);
            toast.success("Order cancelled successfully");
            setClearModal(); 
            refetchOrders(); 
        }catch(error) {
            if(error.status === 404) {
                toast.error(error.data.error);
                setClearModal(); 
            }else {
                refetchOrders();
                toast.error("An error occurred while cancelling this order");
            }
        }
    }, []);
 
    const onNo = useCallback(() => {
        setClearModal(); 
    }, []);
    return(
        <div className="actions mt-[30px] flex flex-wrap gap-[15px]">
            <button className="flex max-w-[100px] px-[30px] items-center justify-center bg-red-500 text-center cursor-pointer text-[20px] font-bold rounded-[6px] py-[10px] text-black text-uppercase w-full" onClick={onYes}>Yes</button>
            <button className="flex max-w-[100px] px-[30px] items-center justify-center hover:bg-stone-700 hover:text-white text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-stone-400 py-[10px] text-black text-uppercase w-full" onClick={onNo}>No</button>
        </div>
    )
}