import BaseApi from "@/lib/api/_base.api";
import { serverError } from "@/lib/services/globalService";
import modalState from "@/lib/store/modalState";
import { toast } from "react-toastify";
import useEntityState from "@/lib/store/entityState";
import authService from "@/lib/services/authService";
export default function OfferLogout() {
  const { deleteInfo, modalInfo, setModalInfo, modalOpen, setClearModal } =
    modalState((state) => ({
      deleteInfo: state.deleteInfo,
      modalInfo: state.modalInfo,
      setModalInfo: state.setModalInfo,
      modalOpen: state.modalOpen,
      setClearModal: state.setClearModal,
    }));
  const { refetchDeletedMembers } = useEntityState((state) => ({
    refetchDeletedMembers: state.refetchDeletedMembers,
  }));

  const onYes = async () => {
    authService.logoutSession();
    setClearModal();
  };

  const onNo = () => {
    modalState.setState({ modalOpen: false });
  };
  return (
    <div className="actions mt-[30px] flex flex-wrap gap-[15px]">
      <button
        className="inline-flex max-w-[100px] px-[30px] items-center justify-center hover:bg-[#009CFF] text-center cursor-pointer text-[15px] font-bold rounded-[6px] bg-[#009CFF] py-[10px] text-black text-uppercase w-full"
        onClick={onYes}
      >
        Yes
      </button>
      <button
        className="flex max-w-[100px] px-[30px] items-center justify-center hover:bg-stone-700 hover:text-white text-center cursor-pointer text-[20px] font-bold rounded-[6px] bg-stone-400 py-[10px] text-black text-uppercase w-full"
        onClick={onNo}
      >
        No
      </button>
    </div>
  );
}
