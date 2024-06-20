import BaseApi from "@/lib/api/_base.api";
import { serverError } from "@/lib/services/globalService";
import modalState from "@/lib/store/modalState";
import { toast } from "react-toastify";
import useEntityState from "@/lib/store/entityState";
import authService from "@/lib/services/authService";
export default function DeleteMember() {
    const { deleteInfo, modalInfo, setModalInfo, modalOpen, setClearModal } = modalState((state) => ({
        deleteInfo: state.deleteInfo,
        modalInfo: state.modalInfo,
        setModalInfo: state.setModalInfo,
        modalOpen: state.modalOpen,
        setClearModal: state.setClearModal,
      })); 
    const { members, refetchMembers, isMembersLoading } = useEntityState((state) => ({
        members: state.members,
        refetchMembers: state.refetchMembers,
        isMembersLoading: state.isMembersLoading,
      }));

    const onYes = async() => {
        refetchMembers();  
        authService.refetchProfile(); 
        try {
            const res = await BaseApi.delete(process.env.NEXT_PUBLIC_API_URL + `/users/${deleteInfo.id}`);
            if(res.status === 200) {
                setClearModal();
                toast.success("User deleted successfully");
                
            }
        }catch(error) {
            console.log('Error', error)  
            if(error && error.status === 422) {
                toast.error(error.data.message);
            }
            if(error && error.status === 500) {
                serverError();
            } 
        }
    }
    

    const onNo = () => {
        modalState.setState({ modalOpen: false }) 
    }
    return(
        <div className="actions mt-[30px] flex flex-wrap gap-[15px]">
            <button className="flex max-w-[100px] px-[30px] items-center justify-center hover:bg-red-700 text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-red-500 py-[10px] text-black text-uppercase w-full" onClick={onYes}>Yes</button>
            <button className="flex max-w-[100px] px-[30px] items-center justify-center hover:bg-stone-700 hover:text-white text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-stone-400 py-[10px] text-black text-uppercase w-full" onClick={onNo}>No</button>
        </div>
    )
}