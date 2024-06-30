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
    const {  refetchDeletedMembers,  } = useEntityState((state) => ({
        refetchDeletedMembers: state.refetchDeletedMembers,
    }));

      const onYes = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
    
        if (confirmed) {
            try {
                const res = await BaseApi.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${deleteInfo.id}`);
    
                if (res.status === 200) {
                    setClearModal(); // Assuming this function clears the modal state
                    toast.success("User deleted successfully");
                    refetchDeletedMembers(); // Assuming this function refetches member data
                } else {
                    // Handle unexpected response status codes
                    console.error("Unexpected status code:", res.status);
                    serverError(); // Assuming this function handles server errors
                    refetchDeletedMembers(); // Assuming this function refetches member data
                }
            } catch (error) {
                console.error("Error deleting user:", error);
    
                if (error.response && error.response.status === 422) {
                    toast.error(error.response.data.message);
                } else {
                    serverError(); // Assuming this function handles server errors
                }
                refetchDeletedMembers(); // Assuming this function refetches member data
            }
        }
    }; 
    
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