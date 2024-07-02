import BaseApi from "@/lib/api/_base.api";
import { serverError } from "@/lib/services/globalService";
import modalState from "@/lib/store/modalState";
import { toast } from "react-toastify";
import useEntityState from "@/lib/store/entityState";
export default function DeleteDuration() {
    const { modalInfo, setModalInfo, modalOpen, setClearModal } = modalState((state) => ({
        modalInfo: state.modalInfo,
        setModalInfo: state.setModalInfo,
        modalOpen: state.modalOpen,
        setClearModal: state.setClearModal,
      })); 

      const { refetchmembershipDurations } = useEntityState((state) => ({
        refetchmembershipDurations: state.refetchmembershipDurations,
      }));  

    const onYes = async() => {
        const confirm = window.confirm('Deleting duration will delete all subscriptions and plans/promos associated with it. Are you sure you want to proceed? This cannot be undone.');

        if(confirm) {
            try {
                const res = await BaseApi.delete(process.env.NEXT_PUBLIC_API_URL + `/membership-durations/${modalInfo.deleteId}`);
    
                console.log('res', res) 
                if(res.status === 200) {
                    setClearModal();
                    toast.success("Duration deleted successfully");
                    refetchmembershipDurations();  
                }
            }catch(error) {
                console.log('Error', error)  
                if(error.status === 422) {
                    toast.error('Life time duration cannot be deleted.'); 
                }else {
                    serverError();
                }
            }
        }
    }   
    

    const onNo = () => {
        modalState.setState({ modalOpen: false }) 
    }
    return(
        <div className="actions mt-[30px] flex flex-wrap gap-[15px]">
            <button className="flex hover:bg-black hover:text-white max-w-[100px] px-[30px] items-center justify-center hover:bg-red-700 text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-red-500 py-[10px] text-black text-uppercase w-full" onClick={onYes}>Yes</button>
            <button className="flex max-w-[100px] px-[30px] items-center justify-center hover:bg-stone-700 hover:text-white text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-stone-400 py-[10px] text-black text-uppercase w-full" onClick={onNo}>No</button>
        </div>
    )
}