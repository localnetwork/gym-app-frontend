import BaseApi from "@/lib/api/_base.api";
import { serverError } from "@/lib/services/globalService";
import modalState from "@/lib/store/modalState";
import { toast } from "react-toastify";
import useEntityState from "@/lib/store/entityState";
import authService from "@/lib/services/authService";
export default function RestoreUser() {
    const { deleteInfo, modalInfo, setModalInfo, modalOpen, setClearModal } = modalState((state) => ({
        deleteInfo: state.deleteInfo,
        modalInfo: state.modalInfo,
        setModalInfo: state.setModalInfo,
        modalOpen: state.modalOpen,
        setClearModal: state.setClearModal,
      })); 
      const { refetchDeletedMembers } = useEntityState((state) => ({
        refetchDeletedMembers: state.refetchDeletedMembers,
      }));

    const onYes = async() => {
          
        authService.refetchProfile(); 
        try {
            const res = await BaseApi.put(process.env.NEXT_PUBLIC_API_URL + `/users/${deleteInfo.id}/restore`);
            if(res.status === 200) {
                setClearModal();
                toast.success("User restored successfully");
                refetchDeletedMembers();
            }
        }catch(error) {
            console.log('Error', error)  
            if(error && error.status === 422) {
                toast.error(error.data.message);
            }
            if(error && error.status === 500) {
                serverError();
            }
            refetchDeletedMembers(); 
        }
    }
    
    const onNo = () => {
        modalState.setState({ modalOpen: false }) 
    }
    return(
        <div className="actions mt-[30px] flex flex-wrap gap-[15px]">
            <button className="inline-flex max-w-[100px] px-[30px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-[#009CFF] py-[10px] text-black text-uppercase w-full" onClick={onYes}>Yes</button>
            <button className="flex max-w-[100px] px-[30px] items-center justify-center hover:bg-stone-700 hover:text-white text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-stone-400 py-[10px] text-black text-uppercase w-full" onClick={onNo}>No</button>
        </div>
    )
}